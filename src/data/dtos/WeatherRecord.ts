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
        this._id = params.id;
        this._timestamp = params.timestamp;
        this._data = params.data;
        this._device = params.device;
    }

    /** Unique identifier for this weather record. */
    public get id(): string {
        return this._id;
    }

    /** Timestamp of when this weather record was created (in ISO 8601 format). */
    public get timestamp(): string {
        return this._timestamp;
    }

    /** Aggregated or processed weather data collected at the time of this record. */
    public get data(): CurrentWeatherData {
        return this._data;
    }

    /** Metadata about the device that generated this weather record. */
    public get device(): DeviceInfo {
        return this._device;
    }

    // Private fields (defined at bottom per preferred style)
    private readonly _id: string;
    private readonly _timestamp: string;
    private readonly _data: CurrentWeatherData;
    private readonly _device: DeviceInfo;
}
