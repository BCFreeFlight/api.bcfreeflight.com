// DynamoDBDeviceRepository.ts
import {GetItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {unmarshall} from "@aws-sdk/util-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {DeviceInfo} from "./dtos/DeviceInfo";


/**
 * A repository for interacting with a table containing device data.
 * This repository provides a method to get devices by their id.
 */
export class AwsDynamoDBDeviceRepository {

    /**
     * Creates a new instance of AwsDynamoDBDeviceRepository.
     *
     * @param {DynamoDBClient} dbClient - The DynamoDB client to use for database operations.
     * @param {string} tableName - The name of the DynamoDB table containing device data.
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
     * Finds and retrieves the record associated with the provided id from the table.
     * The uploadKey parameter is now treated as the table's id column.
     *
     * @param {string} id - The id of the record to retrieve (previously this was the upload key).
     * @return {Promise<Record<string, any>|null>} A promise that resolves to the retrieved item or null if not found.
     * @throws {Error} Throws an error if the uploadKey (id) is not provided.
     */
    async findById(id: string): Promise<DeviceInfo | null> {
        if (!id) throw new Error("uploadKey is required");

        const getCommand = new GetItemCommand({
            TableName: this._tableName,
            Key: {
                id: {S: id}
            }
        });

        const result = await this._client.send(getCommand);
        return result.Item ? this._factory(unmarshall(result.Item)) : null;
    }

    private _factory(data: Record<string, any>): DeviceInfo {
        return new DeviceInfo(data.id,
            data.elevation,
            data.height,
            data.latitude,
            data.location,
            data.longitude,
            data.name,
            data.timezone);
    }

    private readonly _client: DynamoDBDocumentClient;
    private readonly _tableName: string;
}
