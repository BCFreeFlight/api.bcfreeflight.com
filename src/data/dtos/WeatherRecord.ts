import {CurrentWeatherData} from "./CurrentWeatherData";
import {AverageWeatherData} from "./AverageWeatherData";
import {DeviceInfo} from "./DeviceInfo";

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
     * @param {CurrentWeatherData | AverageWeatherData} data - The weather data associated with the record.
     * @param {DeviceInfo} device - The device information from which the record was collected.
     */
    constructor(
        public readonly id: string,
        public readonly timestamp: string,
        public readonly data: TWeatherData,
        public readonly device: DeviceInfo
    ) {
    }
}
