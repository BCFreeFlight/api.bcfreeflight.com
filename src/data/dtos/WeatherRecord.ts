import {CurrentWeatherData} from "./CurrentWeatherData";
import {DevicePreview} from "./DevicePreview";

/**
 * Class representing a weather data input object.
 *
 * This class is designed to structure the data received from weather stations or devices.
 */
export class WeatherRecord {
    /**
     * Creates a new instance of WeatherDataInput.
     * 
     * @param {string} id - The unique identifier for the weather data entry.
     * @param {DevicePreview} device - Details of the device that collected the weather data.
     * @param {string} timestamp - The timestamp when the data was collected.
     * @param {CurrentWeatherData} data - The actual weather data readings.
     */
    constructor(
        public readonly id: string,
        public readonly device: DevicePreview,
        public readonly timestamp: string,
        public readonly data: CurrentWeatherData
    ) {}
}