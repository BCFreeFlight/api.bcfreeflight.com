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
        this.client = DynamoDBDocumentClient.from(dbClient, {
            marshallOptions: {
                removeUndefinedValues: true,
            },
        });
        this.tableName = tableName;
    }

    /**
     * @inheritdoc
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

    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;
}