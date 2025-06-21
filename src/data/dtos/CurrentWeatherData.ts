/**
 * Represents the current weather data collected from a weather station.
 *
 * This class provides properties to access various weather-related measurements such as temperature, pressure, humidity, wind speed, and rainfall.
 */
export class CurrentWeatherData {

    /**
     * Creates an instance of a weather data object and initializes its properties.
     *
     * @param {number} baromabsin - Absolute atmospheric pressure in inches.
     * @param {number} baromrelin - Relative atmospheric pressure in inches.
     * @param {number} dailyrainin - Daily rainfall amount in inches.
     * @param {string} dateutc - UTC date and time in string format.
     * @param {number} eventrainin - Rainfall amount for a specific event in inches.
     * @param {string} freq - Frequency of data reporting.
     * @param {number} heap - System heap memory usage.
     * @param {number} hourlyrainin - Hourly rainfall amount in inches.
     * @param {number} humidity - Outdoor humidity percentage.
     * @param {number} humidityin - Indoor humidity percentage.
     * @param {number} interval - Data reporting interval in seconds.
     * @param {number} maxdailygust - Maximum gust speed for the day in miles per hour.
     * @param {string} model - Model of the weather station.
     * @param {number} monthlyrainin - Monthly rainfall amount in inches.
     * @param {string} PASSKEY - Unique key associated with the weather station.
     * @param {number} rainratein - Rain rate in inches per hour.
     * @param {number} runtime - System runtime in seconds.
     * @param {number} solarradiation - Solar radiation in watts per square meter.
     * @param {string} stationtype - Type of the weather station.
     * @param {number} tempf - Outdoor temperature in Fahrenheit.
     * @param {number} tempinf - Indoor temperature in Fahrenheit.
     * @param {number} totalrainin - Total rainfall amount in inches.
     * @param {number} uv - Ultraviolet index measurement.
     * @param {number} vpd - Vapor pressure deficit in millibars.
     * @param {number} weeklyrainin - Weekly rainfall amount in inches.
     * @param {number} wh65batt - Battery status for the WH65 sensor.
     * @param {number} winddir - Wind direction in degrees.
     * @param {number} windgustmph - Wind gust speed in miles per hour.
     * @param {number} windspeedmph - Wind speed in miles per hour.
     * @param {number} yearlyrainin - Yearly rainfall amount in inches.
     */
    constructor(
        public readonly baromabsin: number,
        public readonly baromrelin: number,
        public readonly dailyrainin: number,
        public readonly dateutc: string,
        public readonly eventrainin: number,
        public readonly freq: string,
        public readonly heap: number,
        public readonly hourlyrainin: number,
        public readonly humidity: number,
        public readonly humidityin: number,
        public readonly interval: number,
        public readonly maxdailygust: number,
        public readonly model: string,
        public readonly monthlyrainin: number,
        public readonly PASSKEY: string,
        public readonly rainratein: number,
        public readonly runtime: number,
        public readonly solarradiation: number,
        public readonly stationtype: string,
        public readonly tempf: number,
        public readonly tempinf: number,
        public readonly totalrainin: number,
        public readonly uv: number,
        public readonly vpd: number,
        public readonly weeklyrainin: number,
        public readonly wh65batt: number,
        public readonly winddir: number,
        public readonly windgustmph: number,
        public readonly windspeedmph: number,
        public readonly yearlyrainin: number
    ) {}
}
