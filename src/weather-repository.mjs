// weather-repository.mjs
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Class representing a repository for weather data operations using DynamoDB.
 */
class DynamoDBWeatherRepository {
    /**
     * Creates an instance of the class with the specified database client and table name.
     *
     * @param {Object} dbClient - The database client to interact with the database.
     * @param {string} tableName - The name of the database table to be used.
     * @return {void}
     */
    constructor(dbClient, tableName) {
        this.client = DynamoDBDocumentClient.from(dbClient, {
            marshallOptions: {
                removeUndefinedValues: true,
            },
        });
        this.tableName = tableName;
    }

    /**
     * Saves weather data into the database.
     *
     * @param {Object} params The parameters for saving the weather data.
     * @param {string} params.id The unique identifier for the weather data entry.
     * @param {Object} params.device The device submitting the weather data.
     * @param {string} params.timestamp The timestamp of the weather data.
     * @param {Object} params.data The weather data object to be saved.
     * @return {Promise<Object>} A promise that resolves to the result of the database operation.
     */
    async saveWeatherData({ id, device, timestamp, data }) {
        let payload = { id, device, timestamp, data };
        const putCommand = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall(payload, { removeUndefinedValues: true })
        });
        await this.client.send(putCommand);
        return payload;
    }
}

export { DynamoDBWeatherRepository };