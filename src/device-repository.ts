// device-repository.ts
import { GetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DeviceRepository } from './types/interfaces';

/**
 * A repository class for interacting with a DynamoDB table containing device data.
 * This class provides a method to get devices by their id using the AWS SDK.
 */
class DynamoDBDeviceRepository implements DeviceRepository {
    private client: DynamoDBDocumentClient;
    private tableName: string;

    /**
     * Constructs an instance of the class with the specified database client and table name.
     *
     * @param {DynamoDBClient} dbClient - The database client used to interact with the database.
     * @param {string} tableName - The name of the table to perform operations on.
     */
    constructor(dbClient: DynamoDBClient, tableName: string) {
        this.client = DynamoDBDocumentClient.from(dbClient, {
            marshallOptions: {
                removeUndefinedValues: true,
            },
        });
        this.tableName = tableName;
    }

    /**
     * Finds and retrieves the record associated with the provided id from the table.
     * The uploadKey parameter is now treated as the table's id column.
     *
     * @param {string} id - The id of the record to retrieve (previously this was the upload key).
     * @return {Promise<Record<string, any>|null>} A promise that resolves to the retrieved item or null if not found.
     * @throws {Error} Throws an error if the uploadKey (id) is not provided.
     */
    async findById(id: string): Promise<Record<string, any> | null> {
        if (!id) throw new Error("uploadKey is required");

        const getCommand = new GetItemCommand({
            TableName: this.tableName,
            Key: {
                id: {S: id}
            }
        });

        const result = await this.client.send(getCommand);
        return result.Item ? (unmarshall(result.Item) || null) : null;
    }
}

export { DynamoDBDeviceRepository };
