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
        console.log(`[Repository] ListCurrent: Scanning table ${this._currentWeatherTable}`);
        const scanCommand = new ScanCommand({
            TableName: this._currentWeatherTable
        });

        console.log(`[Repository] ListCurrent: Sending scan command`);
        const result = await this._client.send(scanCommand);
        console.log(`[Repository] ListCurrent: Scan command completed`);

        if (!result.Items) {
            console.log(`[Repository] ListCurrent: No items found`);
            return [];
        }

        const records = result.Items.map(item => unmarshall(item) as WeatherRecord<CurrentWeatherData>);
        console.log(`[Repository] ListCurrent: Retrieved ${records.length} records`);
        return records;
    }

    /**
     * Saves the current weather record into the database.
     *
     * @param {WeatherRecord<AverageWeatherData>} input - The current weather record to be saved. This object contains the data to persist including an identifier and other weather-related properties.
     * @return {Promise<string>} A promise that resolves to the ID of the saved weather record.
     */
    async SaveCurrent(input: WeatherRecord<CurrentWeatherData>): Promise<void> {
        console.log(`[Repository] SaveCurrent: Saving current weather data for device ${input.deviceId}`);
        const putCommand = new PutItemCommand({
            TableName: this._currentWeatherTable,
            Item: marshall(input, {removeUndefinedValues: true, convertClassInstanceToMap: true})
        });
        console.log(`[Repository] SaveCurrent: Sending put command to table ${this._currentWeatherTable}`);
        await this._client.send(putCommand);
        console.log(`[Repository] SaveCurrent: Successfully saved current weather data for device ${input.deviceId}`);
    }

    /**
     * Saves the provided weather record into the database.
     *
     * @param {WeatherRecord} input - The weather record object to be saved. It includes weather attributes and an identifier.
     * @return {Promise<string>} A promise that resolves to the identifier of the saved record.
     */
    async SaveAverage(input: WeatherRecord<AverageWeatherData>): Promise<void> {
        console.log(`[Repository] SaveAverage: Saving average weather data for device ${input.deviceId}`);
        const putCommand = new PutItemCommand({
            TableName: this._averageWeatherTable,
            Item: marshall(input, {removeUndefinedValues: true, convertClassInstanceToMap: true})
        });
        console.log(`[Repository] SaveAverage: Sending put command to table ${this._averageWeatherTable}`);
        await this._client.send(putCommand);
        console.log(`[Repository] SaveAverage: Successfully saved average weather data for device ${input.deviceId}`);
    }

    /**
     * Deletes all items with the specified IDs from the current weather table.
     * The deletion is performed in batches due to the database's batch write limit.
     *
     * @param {string[]} deviceIds - An array of IDs representing the items to be deleted. If the array is empty, the method returns without performing any action.
     * @return {Promise<void>} A promise that resolves once all specified items have been deleted.
     */
    async DeleteAll(deviceIds: string[]): Promise<void> {
        console.log(`[Repository] DeleteAll: Starting deletion for ${deviceIds.length} devices`);
        if (deviceIds.length === 0) {
            console.log(`[Repository] DeleteAll: No devices to delete, returning early`);
            return;
        }

        for (const deviceId of deviceIds) {
            console.log(`[Repository] DeleteAll: Processing device ${deviceId}`);
            let lastEvaluatedKey = undefined;
            let allItems: any[] = [];

            // Query all items for the current deviceId, handling pagination
            console.log(`[Repository] DeleteAll: Querying items for device ${deviceId}`);
            do {
                const queryCommand: QueryCommand = new QueryCommand({
                    TableName: this._currentWeatherTable,
                    KeyConditionExpression: "deviceId = :deviceId",
                    ExpressionAttributeValues: marshall({
                        ':deviceId': deviceId
                    }),
                    ExclusiveStartKey: lastEvaluatedKey
                });

                console.log(`[Repository] DeleteAll: Sending query command for device ${deviceId}`);
                const queryResult = await this._client.send(queryCommand);
                console.log(`[Repository] DeleteAll: Query command completed for device ${deviceId}`);

                if (queryResult.Items) {
                    const itemCount = queryResult.Items.length;
                    console.log(`[Repository] DeleteAll: Found ${itemCount} items for device ${deviceId}`);
                    allItems = allItems.concat(queryResult.Items);
                }
                lastEvaluatedKey = queryResult.LastEvaluatedKey;
                if (lastEvaluatedKey) {
                    console.log(`[Repository] DeleteAll: More items exist, continuing pagination for device ${deviceId}`);
                }
            } while (lastEvaluatedKey);

            console.log(`[Repository] DeleteAll: Total items to delete for device ${deviceId}: ${allItems.length}`);
            const batchSize = 25;

            for (let i = 0; i < allItems.length; i += batchSize) {
                const batch = allItems.slice(i, i + batchSize);
                const batchNumber = Math.floor(i / batchSize) + 1;
                const totalBatches = Math.ceil(allItems.length / batchSize);
                console.log(`[Repository] DeleteAll: Processing batch ${batchNumber}/${totalBatches} for device ${deviceId}`);

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

                console.log(`[Repository] DeleteAll: Sending batch delete command for device ${deviceId}, batch ${batchNumber}/${totalBatches}`);
                await this._client.send(batchWriteCommand);
                console.log(`[Repository] DeleteAll: Successfully deleted batch ${batchNumber}/${totalBatches} for device ${deviceId}`);
            }
            console.log(`[Repository] DeleteAll: Completed deletion for device ${deviceId}`);
        }
        console.log(`[Repository] DeleteAll: Completed deletion for all devices`);
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
        console.log(`[Repository] List: Querying average weather data for device ${deviceId} on date ${localDate}`);
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

        console.log(`[Repository] List: Sending query command to table ${this._averageWeatherTable}`);
        const result = await this._client.send(queryCommand);
        console.log(`[Repository] List: Query command completed`);

        if (!result.Items || result.Items.length === 0) {
            console.log(`[Repository] List: No items found for device ${deviceId} on date ${localDate}`);
            return [];
        }

        // Convert DynamoDB items to WeatherRecord objects and return them
        // The results are already sorted by timestamp (newest first) due to ScanIndexForward: false
        const records = result.Items.map(item => unmarshall(item) as WeatherRecord<AverageWeatherData>);
        console.log(`[Repository] List: Retrieved ${records.length} records for device ${deviceId} on date ${localDate}`);
        return records;
    }

    private readonly _client: DynamoDBDocumentClient;
    private readonly _currentWeatherTable: string;
    private readonly _averageWeatherTable: string;
}
