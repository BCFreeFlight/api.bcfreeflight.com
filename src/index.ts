// index.ts
// HTTP
export {AwsLambdaResponseFactory} from './http/AwsLambdaResponseFactory';
export {AwsLambdaApiResponse} from './http/AwsLambdaApiResponse';

// Data repositories
export {AwsDynamoDBDeviceRepository} from './data/AwsDynamoDBDeviceRepository';
export {AwsDynamoDBWeatherRepository} from './data/AwsDynamoDBWeatherRepository';

// Services
export {WeatherService} from './services/WeatherService';
export {DeviceService} from './services/DeviceService';

// Utilities
export {QueryParser} from './util/QueryParser';

// Data Transfer Objects
export {CurrentWeatherRecord} from './data/dtos/CurrentWeatherRecord';
export {DeviceInfo} from './data/dtos/DeviceInfo';
export {CurrentWeatherData} from './data/dtos/CurrentWeatherData';
export {DevicePreview} from './data/dtos/DevicePreview';
export {Range} from './data/dtos/Range';
export {AverageWeatherData} from './data/dtos/AverageWeatherData';


// Import all exports to create a default export
import {AwsLambdaResponseFactory} from './http/AwsLambdaResponseFactory';
import {AwsLambdaApiResponse} from './http/AwsLambdaApiResponse';
import {AwsDynamoDBDeviceRepository} from './data/AwsDynamoDBDeviceRepository';
import {AwsDynamoDBWeatherRepository} from './data/AwsDynamoDBWeatherRepository';
import {WeatherService} from './services/WeatherService';
import {DeviceService} from './services/DeviceService';
import {QueryParser} from './util/QueryParser';
import {DeviceInfo} from './data/dtos/DeviceInfo';
import {CurrentWeatherData} from './data/dtos/CurrentWeatherData';
import {CurrentWeatherRecord} from './data/dtos/CurrentWeatherRecord';
import {DevicePreview} from './data/dtos/DevicePreview';
import {Range} from "./data/dtos/Range";
import {AverageWeatherData} from "./data/dtos/AverageWeatherData";

// Export everything as default as well
const bcfreeflight = {
    AwsLambdaResponseFactory,
    AwsLambdaApiResponse,
    AwsDynamoDBDeviceRepository,
    AwsDynamoDBWeatherRepository,
    WeatherService,
    DeviceService,
    QueryParser,
    WeatherRecord: CurrentWeatherRecord,
    DeviceInfo,
    CurrentWeatherData,
    AverageWeatherData,
    Range,
    DevicePreview
};

export default bcfreeflight;