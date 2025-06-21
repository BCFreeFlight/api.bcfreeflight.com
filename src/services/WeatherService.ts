// WeatherService.ts
import {nanoid} from "nanoid";
import {DeviceInfo} from "../data/dtos/DeviceInfo";
import {CurrentWeatherData} from "../data/dtos/CurrentWeatherData";
import {WeatherRecord} from "../data/dtos/WeatherRecord";
import {WeatherDataInput} from "../data/dtos/WeatherDataInput";
import {AwsDynamoDBWeatherRepository} from "../data/AwsDynamoDBWeatherRepository";

/**
 * Service for weather-related operations.
 */
export class WeatherService {

    /**
     * Creates a new instance of WeatherService.
     * 
     * @param {AwsDynamoDBWeatherRepository} weatherRepository - The repository used to access weather data.
     */
    constructor(weatherRepository: AwsDynamoDBWeatherRepository) {
        this._weatherRepository = weatherRepository;
    }

    /**
     * Processes and computes averages based on a predefined dataset or input.
     * Performs necessary calculations asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the processing is complete.
     */
    async processAverages(): Promise<void> {
        await this._weatherRepository.processAverages();
    }

    /**
     * Saves weather data to the database or designated storage system.
     *
     * @param {DeviceInfo} device - Details of the device that collected the weather data.
     * @param {CurrentWeatherData} data - The actual weather data readings.
     * @return {Promise<WeatherRecord>} A promise that resolves to a confirmation object containing details of the saved data.
     */
    async saveWeatherData(
        device: DeviceInfo,
        data: CurrentWeatherData
    ): Promise<string> {
        const timestamp = new Date().toISOString();
        const id = nanoid();

        const payload = new WeatherDataInput(
            id,
            device.id,
            timestamp,
            data
        );

        return await this._weatherRepository.saveWeatherData(payload);
    }

    private readonly _weatherRepository: AwsDynamoDBWeatherRepository;
}
