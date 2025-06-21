// DynamoDBWeatherRepository.ts
import {PutItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {WeatherRecord} from "./dtos/WeatherRecord";
import {WeatherDataInput} from "./dtos/WeatherDataInput";

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
     * @return {Promise<WeatherRecord>} A promise that resolves to a confirmation object containing details of the saved data.
     */
    async saveWeatherData(input: WeatherDataInput): Promise<string> {
        const putCommand = new PutItemCommand({
            TableName: this._tableName,
            Item: marshall(input, {removeUndefinedValues: true, convertClassInstanceToMap: true})
        });
        await this._client.send(putCommand);
        return input.id;
    }

    private readonly _client: DynamoDBDocumentClient;
    private readonly _tableName: string;
}
