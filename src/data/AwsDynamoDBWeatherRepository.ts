// DynamoDBWeatherRepository.ts
import {PutItemCommand, DynamoDBClient, ScanCommand, QueryCommand, BatchWriteItemCommand} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {WeatherRecord} from "./dtos/WeatherRecord";
import {CurrentWeatherData} from "./dtos/CurrentWeatherData";
import {AverageWeatherData} from "./dtos/AverageWeatherData";

/**
 * Repository for managing weather data.
 */
export class AwsDynamoDBWeatherRepository {
    /**
     * Creates a new instance of AwsDynamoDBWeatherRepository.
     *
     * @param {DynamoDBClient} dbClient - The DynamoDB client to use for database operations.
     * @param {string} currentWeatherTable - The name of the DynamoDB table containing current weather data.
     * @param averageWeatherTable - The name of the DynamoDB table containing average weather data.
     */
    constructor(dbClient: DynamoDBClient, currentWeatherTable: string, averageWeatherTable: string) {
        this._client = DynamoDBDocumentClient.from(dbClient, {
            marshallOptions: {
                removeUndefinedValues: true,
            },
        });
        this._currentWeatherTable = currentWeatherTable;
        this._averageWeatherTable = averageWeatherTable;
    }

    /**
     * Groups weather records by their associated device ID.
     *
     * @return {Promise<WeatherRecord<CurrentWeatherData>[]>} A promise that resolves to an object mapping device IDs to arrays of weather records.
     */
    async ListCurrent(): Promise<WeatherRecord<CurrentWeatherData>[]> {
        const scanCommand = new ScanCommand({
            TableName: this._currentWeatherTable
        });

        const result = await this._client.send(scanCommand);

        if (!result.Items) {
            return [];
        }

        return result.Items.map(item => unmarshall(item) as WeatherRecord<CurrentWeatherData>);
    }

    /**
     * Saves the current weather record into the database.
     *
     * @param {WeatherRecord<AverageWeatherData>} input - The current weather record to be saved. This object contains the data to persist including an identifier and other weather-related properties.
     * @return {Promise<string>} A promise that resolves to the ID of the saved weather record.
     */
    async SaveCurrent(input: WeatherRecord<CurrentWeatherData>): Promise<void> {
        const putCommand = new PutItemCommand({
            TableName: this._currentWeatherTable,
            Item: marshall(input, {removeUndefinedValues: true, convertClassInstanceToMap: true})
        });
        await this._client.send(putCommand);
    }

    /**
     * Saves the provided weather record into the database.
     *
     * @param {WeatherRecord} input - The weather record object to be saved. It includes weather attributes and an identifier.
     * @return {Promise<string>} A promise that resolves to the identifier of the saved record.
     */
    async SaveAverage(input: WeatherRecord<AverageWeatherData>): Promise<void> {
        const putCommand = new PutItemCommand({
            TableName: this._averageWeatherTable,
            Item: marshall(input, {removeUndefinedValues: true, convertClassInstanceToMap: true})
        });
        await this._client.send(putCommand);
    }

    /**
     * Deletes all items with the specified IDs from the current weather table.
     * The deletion is performed in batches due to the database's batch write limit.
     *
     * @param {string[]} deviceIds - An array of IDs representing the items to be deleted. If the array is empty, the method returns without performing any action.
     * @return {Promise<void>} A promise that resolves once all specified items have been deleted.
     */
    async DeleteAll(deviceIds: string[]): Promise<void> {
        if (deviceIds.length === 0) {
            return;
        }

        for (const deviceId of deviceIds) {
            let lastEvaluatedKey = undefined;
            let allItems: any[] = [];

            // Query all items for the current deviceId, handling pagination
            do {
                const queryCommand: QueryCommand = new QueryCommand({
                    TableName: this._currentWeatherTable,
                    KeyConditionExpression: "deviceId = :deviceId",
                    ExpressionAttributeValues: marshall({
                        ':deviceId': deviceId
                    }),
                    ExclusiveStartKey: lastEvaluatedKey
                });

                const queryResult = await this._client.send(queryCommand);

                if (queryResult.Items) {
                    allItems = allItems.concat(queryResult.Items);
                }
                lastEvaluatedKey = queryResult.LastEvaluatedKey;
            } while (lastEvaluatedKey);

            const batchSize = 25;

            for (let i = 0; i < allItems.length; i += batchSize) {
                const batch = allItems.slice(i, i + batchSize);

                const deleteRequests = batch.map(item => ({
                    DeleteRequest: {
                        Key: {
                            deviceId: item.deviceId,
                            timestamp: item.timestamp  // Include the sort key
                        }
                    }
                }));

                const batchWriteCommand = new BatchWriteItemCommand({
                    RequestItems: {
                        [this._currentWeatherTable]: deleteRequests
                    }
                });

                await this._client.send(batchWriteCommand);
            }
        }

    }

    /**
     * Lists weather records from the average weather table based on the provided parameters.
     *
     * @param {string} deviceId - The ID of the device to filter records by. This is a required parameter.
     * @param {string} localDate - The local date parameter in the format MM-DD-YYYY to filter records by.
     * @return {Promise<WeatherRecord<AverageWeatherData>[]>} A promise that resolves to an array of weather records
     *                                                        ordered by timestamp with newest records first.
     */
    async List(deviceId: string, localDate: string): Promise<WeatherRecord<AverageWeatherData>[]> {
        const queryCommand = new QueryCommand({
            TableName: this._averageWeatherTable,
            KeyConditionExpression: '#deviceId = :deviceId',
            FilterExpression: '#localDate = :localDate',
            ExpressionAttributeNames: {
                '#deviceId': 'deviceId',
                '#localDate': 'localDate'
            },
            ExpressionAttributeValues: marshall({
                ':deviceId': deviceId,
                ':localDate': localDate
            }),
            ScanIndexForward: false, // false = descending order (newest first)
        });

        const result = await this._client.send(queryCommand);

        if (!result.Items || result.Items.length === 0) {
            return [];
        }

        // Convert DynamoDB items to WeatherRecord objects and return them
        // The results are already sorted by timestamp (newest first) due to ScanIndexForward: false
        return result.Items.map(item => unmarshall(item) as WeatherRecord<AverageWeatherData>);
    }

    private readonly _client: DynamoDBDocumentClient;
    private readonly _currentWeatherTable: string;
    private readonly _averageWeatherTable: string;
}
