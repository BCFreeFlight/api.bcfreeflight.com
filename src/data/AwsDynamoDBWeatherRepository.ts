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
        this._client = DynamoDBDocumentClient.from(dbClient, {
            marshallOptions: {
                removeUndefinedValues: true,
            },
        });
        this._tableName = tableName;
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
            TableName: this._tableName,
            Item: marshall(payload, {removeUndefinedValues: true})
        });
        await this._client.send(putCommand);
        return payload;
    }

    private readonly _client: DynamoDBDocumentClient;
    private readonly _tableName: string;
}
