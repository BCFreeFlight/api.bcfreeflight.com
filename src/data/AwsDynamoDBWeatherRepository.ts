// DynamoDBWeatherRepository.ts
import {PutItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';
import {IWeatherRepository} from '../interfaces/IWeatherRepository';
import { WeatherRecord } from "./dtos/WeatherRecord";
import {DeviceInfo} from "./dtos/DeviceInfo";
import {CurrentWeatherData} from "./dtos/CurrentWeatherData";

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

    processAverages(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    /**
     * @inheritDoc
     */
    listAllCurrent(): Promise<WeatherRecord[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * @inheritDoc
     */
    async saveWeatherData({id, device, timestamp, data}: {
        id: string;
        device: DeviceInfo;
        timestamp: string;
        data: CurrentWeatherData;
    }): Promise<WeatherRecord> {
        const payload = new WeatherRecord({id, device, timestamp, data});
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