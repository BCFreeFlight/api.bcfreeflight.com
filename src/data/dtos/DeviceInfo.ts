import {DevicePreview} from "./DevicePreview";

/**
 * Represents metadata about a physical weather device, including its
 * location, elevation, and timezone context.
 */
export class DeviceInfo {

    /**
     * Creates a new instance of DeviceInfo.
     * @param id - Unique identifier for the device.
     * @param elevation - Elevation of the device location in feet.
     * @param height - Height of the device above ground level, in feet.
     * @param latitude - Geographic latitude of the device location.
     * @param location - Human-readable description of the device location.
     * @param longitude - Geographic longitude of the device location.
     * @param name - Friendly display name for the device.
     * @param timezone - IANA timezone string for the device's location.
     */
    constructor(
        public readonly id: string,
        public readonly elevation: number,
        public readonly height: number,
        public readonly latitude: number,
        public readonly location: string,
        public readonly longitude: number,
        public readonly name: string,
        public readonly timezone: string
    ) {}

    toPreview(): DevicePreview {
        return new DevicePreview(this.name, this.location, this.timezone, this.elevation, this.height, this.latitude, this.longitude);
    }
}
