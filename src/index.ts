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
export {WeatherRecord} from './data/dtos/WeatherRecord';
export {DeviceInfo} from './data/dtos/DeviceInfo';
export {CurrentWeatherData} from './data/dtos/CurrentWeatherData';
export {WeatherDataInput} from './data/dtos/WeatherDataInput';
export {DevicePreview} from './data/dtos/DevicePreview';

// Import all exports to create a default export
import {AwsLambdaResponseFactory} from './http/AwsLambdaResponseFactory';
import {AwsLambdaApiResponse} from './http/AwsLambdaApiResponse';
import {AwsDynamoDBDeviceRepository} from './data/AwsDynamoDBDeviceRepository';
import {AwsDynamoDBWeatherRepository} from './data/AwsDynamoDBWeatherRepository';
import {WeatherService} from './services/WeatherService';
import {DeviceService} from './services/DeviceService';
import {QueryParser} from './util/QueryParser';
import {WeatherRecord} from './data/dtos/WeatherRecord';
import {DeviceInfo} from './data/dtos/DeviceInfo';
import {CurrentWeatherData} from './data/dtos/CurrentWeatherData';
import {WeatherDataInput} from './data/dtos/WeatherDataInput';
import {DevicePreview} from './data/dtos/DevicePreview';

// Export everything as default as well
const bcfreeflight = {
    AwsLambdaResponseFactory,
    AwsLambdaApiResponse,
    AwsDynamoDBDeviceRepository,
    AwsDynamoDBWeatherRepository,
    WeatherService,
    DeviceService,
    QueryParser,
    WeatherRecord,
    DeviceInfo,
    CurrentWeatherData,
    WeatherDataInput,
    DevicePreview
};

export default bcfreeflight;