// index.mjs
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AwsLambdaResponseFactory, QueryParser, DynamoDBDeviceRepository, DynamoDBWeatherRepository, WeatherService, DeviceService} from "bcfreeflight";

// Table names
const deviceTable = "BCFF_Devices";
const weatherTable = "BCFF_Weather";

// Create dependencies
const dbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const responseFactory = new AwsLambdaResponseFactory();
const queryParser = new QueryParser();
const deviceRepository = new DynamoDBDeviceRepository(dbClient, deviceTable);
const weatherRepository = new DynamoDBWeatherRepository(dbClient, weatherTable);
const weatherService = new WeatherService(weatherRepository);
const deviceService = new DeviceService(deviceRepository);

const handler = async (event) => {
};

export {handler};