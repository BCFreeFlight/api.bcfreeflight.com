import { AverageWeatherData } from './AverageWeatherData';

/**
 * Represents a simplified weather result containing only the device ID and average weather data.
 * This data shape excludes the localDate and timestamp fields that are present in the WeatherRecord class.
 */
export class WeatherResult {
    /**
     * Creates a new instance of WeatherResult.
     * 
     * @param {string} deviceId - The unique identifier for the device.
     * @param {AverageWeatherData} data - The average weather data for the device.
     */
    constructor(
        public readonly deviceId: string,
        public readonly data: AverageWeatherData
    ) {}
}