import { CurrentWeatherData } from "./CurrentWeatherData";
import { DeviceInfo } from "./DeviceInfo";

/**
 * Represents a single summarized weather record that combines processed
 * weather data with metadata about the reporting device.
 */
export class WeatherRecord {
    /**
     * Constructs a new WeatherRecord instance.
     * @param params - An object containing all required properties.
     * @param params.id - Unique identifier for the weather record.
     * @param params.timestamp - ISO timestamp representing when the record was created.
     * @param params.data - Processed weather data (averaged or summarized).
     * @param params.device - Metadata about the device that submitted the data.
     */
    constructor(params: {
        id: string;
        timestamp: string;
        data: CurrentWeatherData;
        device: DeviceInfo;
    }) {
        this.id = params.id;
        this.timestamp = params.timestamp;
        this.data = params.data;
        this.device = params.device;
    }

    /** Unique identifier for this weather record. */
    public readonly id: string;

    /** Timestamp of when this weather record was created (in ISO 8601 format). */
    public readonly timestamp: string;

    /** Aggregated or processed weather data collected at the time of this record. */
    public readonly data: CurrentWeatherData;

    /** Metadata about the device that generated this weather record. */
    public readonly device: DeviceInfo;
}
