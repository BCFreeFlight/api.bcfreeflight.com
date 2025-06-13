// DynamoDBWeatherRepository.ts
import {PutItemCommand, DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {WeatherRecord} from "./dtos/WeatherRecord";
import {DeviceInfo} from "./dtos/DeviceInfo";
import {CurrentWeatherData} from "./dtos/CurrentWeatherData";

/**
 * Repository for managing weather data.
 */
export class AwsDynamoDBWeatherRepository {
    /**
     * Creates a new instance of AwsDynamoDBWeatherRepository.
     * 
     * @param {DynamoDBClient} dbClient - The DynamoDB client to use for database operations.
     * @param {string} tableName - The name of the DynamoDB table containing weather data.
     */
    constructor(dbClient: DynamoDBClient, tableName: string) {
        this._client = DynamoDBDocumentClient.from(dbClient, {
            marshallOptions: {
                removeUndefinedValues: true,
            },
        });
        this._tableName = tableName;
    }

    /**
     * Processes and computes averages based on a predefined dataset or input.
     * Performs necessary calculations asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the processing is complete.
     */
    async processAverages(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Retrieves a list of all current weather records from the database or external source.
     *
     * @return {Promise<WeatherRecord[]>} A promise that resolves to an array of WeatherRecord objects representing all values in the Current Weather table.
     */
    async listAllCurrent(): Promise<WeatherRecord[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * Saves weather data to the database or designated storage system.
     *
     * @param {Object} params - The parameters for the weather data to be saved.
     * @param {string} params.id - The unique identifier for the weather data entry.
     * @param {DeviceInfo} params.device - Details of the device that collected the weather data.
     * @param {string} params.timestamp - The timestamp when the data was collected.
     * @param {CurrentWeatherData} params.data - The actual weather data readings.
     * @return {Promise<WeatherRecord>} A promise that resolves to a confirmation object containing details of the saved data.
     */
    async saveWeatherData({id, device, timestamp, data}: {
        id: string;
        device: DeviceInfo;
        timestamp: string;
        data: CurrentWeatherData;
    }): Promise<WeatherRecord> {
        const payload = new WeatherRecord({id, device, timestamp, data});
        const putCommand = new PutItemCommand({
            TableName: this._tableName,
            Item: marshall(payload, {removeUndefinedValues: true})
        });
        await this._client.send(putCommand);
        return payload;
    }

    private readonly _client: DynamoDBDocumentClient;
    private readonly _tableName: string;
}
