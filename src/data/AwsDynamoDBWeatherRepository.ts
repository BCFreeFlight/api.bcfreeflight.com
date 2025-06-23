// DynamoDBWeatherRepository.ts
import {PutItemCommand, DynamoDBClient, ScanCommand, BatchWriteItemCommand} from "@aws-sdk/client-dynamodb";
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
    async ListAll(): Promise<WeatherRecord<CurrentWeatherData>[]> {
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
    async SaveCurrent(input: WeatherRecord<CurrentWeatherData>): Promise<string> {
        const putCommand = new PutItemCommand({
            TableName: this._currentWeatherTable,
            Item: marshall(input, {removeUndefinedValues: true, convertClassInstanceToMap: true})
        });
        await this._client.send(putCommand);
        return input.id;
    }

    /**
     * Saves the provided weather record into the database.
     *
     * @param {WeatherRecord} input - The weather record object to be saved. It includes weather attributes and an identifier.
     * @return {Promise<string>} A promise that resolves to the identifier of the saved record.
     */
    async SaveAverage(input: WeatherRecord<AverageWeatherData>): Promise<string> {
        const putCommand = new PutItemCommand({
            TableName: this._averageWeatherTable,
            Item: marshall(input, {removeUndefinedValues: true, convertClassInstanceToMap: true})
        });
        await this._client.send(putCommand);
        return input.id;
    }

    /**
     * Deletes all items with the specified IDs from the current weather table.
     * The deletion is performed in batches due to the database's batch write limit.
     *
     * @param {string[]} ids - An array of IDs representing the items to be deleted. If the array is empty, the method returns without performing any action.
     * @return {Promise<void>} A promise that resolves once all specified items have been deleted.
     */
    async DeleteAll(ids: string[]): Promise<void> {
        if (ids.length === 0) {
            return;
        }

        // Delete items in batches (DynamoDB batch write limit is 25 items)
        const batchSize = 25;

        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize);

            const deleteRequests = batch.map(id => ({
                DeleteRequest: {
                    Key: marshall({id})
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

    private readonly _client: DynamoDBDocumentClient;
    private readonly _currentWeatherTable: string;
    private readonly _averageWeatherTable: string;

}
