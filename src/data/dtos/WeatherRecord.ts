import {CurrentWeatherData} from "./CurrentWeatherData";
import {AverageWeatherData} from "./AverageWeatherData";
import {DeviceInfo} from "./DeviceInfo";
import {nanoid} from "nanoid";

/**
 * Represents a single summarized weather record that combines processed
 * weather data with metadata about the reporting device.
 */
export class WeatherRecord<TWeatherData extends CurrentWeatherData | AverageWeatherData> {

    /**
     * Constructor for creating an instance of the WeatherDataRecord class.
     *
     * @param {string} id - The unique identifier for the record.
     * @param {string} timestamp - The timestamp when the record was created.
     * @param {string} localDate - The local date of the record in the device's timezone (date portion only).
     * @param {CurrentWeatherData | AverageWeatherData} data - The weather data associated with the record.
     * @param {DeviceInfo} device - The device information from which the record was collected.
     */
    constructor(
        public readonly id: string,
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
        const id = nanoid();
        const date = new Date();
        const timestamp = date.toISOString();
        const localDate = new Intl.DateTimeFormat('en-US', {
            timeZone: device.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date).split('/').join('-');

        return new WeatherRecord<TWeatherData>(id, timestamp, localDate, data, device);
    }
}
