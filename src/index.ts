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
export {DeviceInfo} from './data/dtos/DeviceInfo';
export {CurrentWeatherData} from './data/dtos/CurrentWeatherData';
export {DevicePreview} from './data/dtos/DevicePreview';
export {Range} from './data/dtos/Range';
export {ReadOnlyDateTimeRange} from './data/dtos/ReadOnlyDateTimeRange';
export {AverageWeatherData} from './data/dtos/AverageWeatherData';
export {WeatherRecord} from './data/dtos/WeatherRecord';


// Import all exports to Create a default export
import {AwsLambdaResponseFactory} from './http/AwsLambdaResponseFactory';
import {AwsLambdaApiResponse} from './http/AwsLambdaApiResponse';
import {AwsDynamoDBDeviceRepository} from './data/AwsDynamoDBDeviceRepository';
import {AwsDynamoDBWeatherRepository} from './data/AwsDynamoDBWeatherRepository';
import {WeatherService} from './services/WeatherService';
import {DeviceService} from './services/DeviceService';
import {QueryParser} from './util/QueryParser';
import {DeviceInfo} from './data/dtos/DeviceInfo';
import {CurrentWeatherData} from './data/dtos/CurrentWeatherData';
import {DevicePreview} from './data/dtos/DevicePreview';
import {Range} from "./data/dtos/Range";
import {ReadOnlyDateTimeRange} from "./data/dtos/ReadOnlyDateTimeRange";
import {AverageWeatherData} from "./data/dtos/AverageWeatherData";
import {WeatherRecord} from "./data/dtos/WeatherRecord";

// Export everything as default as well
const bcfreeflight = {
    AwsLambdaResponseFactory,
    AwsLambdaApiResponse,
    AwsDynamoDBDeviceRepository,
    AwsDynamoDBWeatherRepository,
    WeatherService,
    DeviceService,
    QueryParser,
    DeviceInfo,
    CurrentWeatherData,
    AverageWeatherData,
    Range,
    ReadOnlyDateTimeRange,
    DevicePreview,
    WeatherRecord
};

export default bcfreeflight;
