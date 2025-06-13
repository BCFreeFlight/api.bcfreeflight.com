import {WeatherRecord} from "../data/dtos/WeatherRecord";
import {CurrentWeatherData} from "../data/dtos/CurrentWeatherData";
import {DeviceInfo} from "../data/dtos/DeviceInfo";

/**
 * Interface representing a repository for managing weather data.
 */
export interface IWeatherRepository {
    /**
     * Saves weather data to the database or designated storage system.
     *
     * @param {Object} params - The parameters for the weather data to be saved.
     * @param {string} params.id - The unique identifier for the weather data entry.
     * @param {DeviceInfo} params.device - Details of the device that collected the weather data.
     * @param {string} params.timestamp - The timestamp when the data was collected.
     * @param {CurrentWeatherData} params.data - The actual weather data readings.
     * @return {Promise<WeatherRecord>} A promise that resolves to a confirmation object containing details of the saved data.
     */
    saveWeatherData(params: {
        id: string;
        device: DeviceInfo;
        timestamp: string;
        data: CurrentWeatherData;
    }): Promise<WeatherRecord>;

    /**
     * Retrieves a list of all current weather records from the database or external source.
     *
     * @return {Promise<WeatherRecord[]>} A promise that resolves to an array of WeatherRecord objects representing all values in the Current Weather table.
     */
    listAllCurrent(): Promise<WeatherRecord[]>;

    /**
     * Processes and computes averages based on a predefined dataset or input.
     * Performs necessary calculations asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the processing is complete.
     */
    processAverages(): Promise<void>;
}