// DynamoDBDeviceRepository.ts
import {GetItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {unmarshall} from "@aws-sdk/util-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {IDeviceRepository} from '../interfaces/IDeviceRepository';

/**
 * @inheritdoc
 */
export class AwsDynamoDBDeviceRepository implements IDeviceRepository {

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    async findById(id: string): Promise<Record<string, any> | null> {
        if (!id) throw new Error("uploadKey is required");

        const getCommand = new GetItemCommand({
            TableName: this._tableName,
            Key: {
                id: {S: id}
            }
        });

        const result = await this._client.send(getCommand);
        return result.Item ? (unmarshall(result.Item) || null) : null;
    }

    private readonly _client: DynamoDBDocumentClient;
    private readonly _tableName: string;
}