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
        id: string,
        elevation: number,
        height: number,
        latitude: number,
        location: string,
        longitude: number,
        name: string,
        timezone: string
    ) {
        this._id = id;
        this._elevation = elevation;
        this._height = height;
        this._latitude = latitude;
        this._location = location;
        this._longitude = longitude;
        this._name = name;
        this._timezone = timezone;
    }

    /** Unique identifier for the device. */
    public get id(): string {
        return this._id;
    }

    /** Elevation of the device's location in feet above sea level. */
    public get elevation(): number {
        return this._elevation;
    }

    /** Height of the device above ground level in feet. */
    public get height(): number {
        return this._height;
    }

    /** Geographic latitude of the device's location. */
    public get latitude(): number {
        return this._latitude;
    }

    /** Human-readable description of the device's physical location. */
    public get location(): string {
        return this._location;
    }

    /** Geographic longitude of the device's location. */
    public get longitude(): number {
        return this._longitude;
    }

    /** Friendly display name for the device (e.g., "Cooper's"). */
    public get name(): string {
        return this._name;
    }

    /** IANA timezone string (e.g., "America/Vancouver") for the device's location. */
    public get timezone(): string {
        return this._timezone;
    }

    // Private fields (bottom as per style preference)
    private readonly _id: string;
    private readonly _elevation: number;
    private readonly _height: number;
    private readonly _latitude: number;
    private readonly _location: string;
    private readonly _longitude: number;
    private readonly _name: string;
    private readonly _timezone: string;
}