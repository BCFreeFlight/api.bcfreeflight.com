import {CurrentWeatherData} from "./CurrentWeatherData";
import {AverageWeatherData} from "./AverageWeatherData";
import {DeviceInfo} from "./DeviceInfo";

/**
 * Represents a single summarized weather record that combines processed
 * weather data with metadata about the reporting device.
 */
export class WeatherRecord<TWeatherData extends CurrentWeatherData | AverageWeatherData> {

    /**
     * Constructor for creating an instance of the class with weather data and device information.
     *
     * @param {string} deviceId - Unique identifier for the device.
     * @param {string} timestamp - The timestamp of when the data was recorded.
     * @param {string} localDate - The local date corresponding to the data recording.
     * @param {TWeatherData extends CurrentWeatherData | AverageWeatherData} data - Weather data collected from the device.
     * @param {DeviceInfo} device - Information about the device from which the data was collected.
     */
    constructor(
        public readonly deviceId: string,
        public readonly timestamp: string,
        public readonly localDate: string,
        public readonly data: TWeatherData,
        public readonly device: DeviceInfo
    ) {
    }

    /**
     * Creates a new WeatherRecord with an auto-generated ID and current date.
     *
     * @param {TWeatherData extends CurrentWeatherData | AverageWeatherData} data - The weather data associated with the record.
     * @param {DeviceInfo} device - The device information from which the record was collected.
     * @returns {WeatherRecord<TWeatherData extends CurrentWeatherData | AverageWeatherData>} A new WeatherRecord instance.
     */
    static Create<TWeatherData extends CurrentWeatherData | AverageWeatherData>(
        data: TWeatherData,
        device: DeviceInfo
    ): WeatherRecord<TWeatherData> {
        const date = new Date();
        const timestamp = date.toISOString();
        const localDate = new Intl.DateTimeFormat('en-US', {
            timeZone: device.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date).split('/').join('-');
        return new WeatherRecord<TWeatherData>(device.id, timestamp, localDate, data, device);
    }
}
