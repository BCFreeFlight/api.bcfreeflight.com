import {DeviceInfo} from "../data/dtos/DeviceInfo";
import {CurrentWeatherData} from "../data/dtos/CurrentWeatherData";

/**
 * Interface representing a weather data input object.
 *
 * This interface is designed to structure the data received from weather stations or devices.
 */
export interface IWeatherDataInput {
    id: string;
    device: DeviceInfo;
    timestamp: string;
    data: CurrentWeatherData;
}