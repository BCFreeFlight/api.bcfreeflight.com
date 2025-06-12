/**
 * Interface representing a weather data input object.
 *
 * This interface is designed to structure the data received from weather stations or devices.
 */
export interface IWeatherDataInput {
    id: string;
    device: Record<string, any>;
    timestamp: string;
    data: Record<string, any>;
}