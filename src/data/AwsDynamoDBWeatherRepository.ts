// DynamoDBWeatherRepository.ts
import {PutItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {IWeatherRepository} from '../interfaces/IWeatherRepository';

/**
 * @inheritDoc
 */
export class AwsDynamoDBWeatherRepository implements IWeatherRepository {
    /**
     * @inheritDoc
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
     * @inheritDoc
     */
    async saveWeatherData({id, device, timestamp, data}: {
        id: string;
        device: Record<string, any>;
        timestamp: string;
        data: Record<string, any>;
    }): Promise<Record<string, any>> {
        const payload = {id, device, timestamp, data};
        const putCommand = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall(payload, {removeUndefinedValues: true})
        });
        await this.client.send(putCommand);
        return payload;
    }

    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;
}