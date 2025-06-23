import {Range} from './Range';
import {CurrentWeatherData} from './CurrentWeatherData';
import {ReadOnlyDateTimeRange} from './ReadOnlyDateTimeRange';

/**
 * Represents the average weather data collected from a weather station over a period.
 *
 * This class provides properties to access various weather-related measurements such as temperature, pressure, humidity, wind speed, and rainfall,
 * where each numeric value is represented as a Range object containing minimum, maximum, and average values.
 */
export class AverageWeatherData {
    /**
     * Creates an instance of an average weather data object and initializes its properties.
     *
     * @param {Range} baromabsin - Absolute atmospheric pressure in inches.
     * @param {Range} baromrelin - Relative atmospheric pressure in inches.
     * @param {Range} dailyrainin - Daily rainfall amount in inches.
     * @param {Range} eventrainin - Rainfall amount for a specific event in inches.
     * @param {string} freq - Frequency of data reporting.
     * @param {Range} heap - System heap memory usage.
     * @param {Range} hourlyrainin - Hourly rainfall amount in inches.
     * @param {Range} humidity - Outdoor humidity percentage.
     * @param {Range} humidityin - Indoor humidity percentage.
     * @param {Range} interval - Data reporting interval in seconds.
     * @param {Range} maxdailygust - Maximum gust speed for the day in miles per hour.
     * @param {string} model - Model of the weather station.
     * @param {Range} monthlyrainin - Monthly rainfall amount in inches.
     * @param {string} PASSKEY - Unique key associated with the weather station.
     * @param {Range} rainratein - Rain rate in inches per hour.
     * @param {Range} runtime - System runtime in seconds.
     * @param {Range} solarradiation - Solar radiation in watts per square meter.
     * @param {string} stationtype - Type of the weather station.
     * @param {Range} tempf - Outdoor temperature in Fahrenheit.
     * @param {Range} tempinf - Indoor temperature in Fahrenheit.
     * @param {Range} totalrainin - Total rainfall amount in inches.
     * @param {Range} uv - Ultraviolet index measurement.
     * @param {Range} vpd - Vapor pressure deficit in millibars.
     * @param {Range} weeklyrainin - Weekly rainfall amount in inches.
     * @param {Range} wh65batt - Battery status for the WH65 sensor.
     * @param {Range} winddir - Wind direction in degrees.
     * @param {Range} windgustmph - Wind gust speed in miles per hour.
     * @param {Range} windspeedmph - Wind speed in miles per hour.
     * @param {Range} yearlyrainin - Yearly rainfall amount in inches.
     * @param {number} recordCount - Number of records contributing to the average.
     * @param {ReadOnlyDateTimeRange} dateTimeRangeUtc - The range of timestamps covered by this average data in utc.
     */
    constructor(
        public readonly baromabsin: Range,
        public readonly baromrelin: Range,
        public readonly dailyrainin: Range,
        public readonly eventrainin: Range,
        public readonly freq: string,
        public readonly heap: Range,
        public readonly hourlyrainin: Range,
        public readonly humidity: Range,
        public readonly humidityin: Range,
        public readonly interval: Range,
        public readonly maxdailygust: Range,
        public readonly model: string,
        public readonly monthlyrainin: Range,
        public readonly PASSKEY: string,
        public readonly rainratein: Range,
        public readonly runtime: number,
        public readonly solarradiation: Range,
        public readonly stationtype: string,
        public readonly tempf: Range,
        public readonly tempinf: Range,
        public readonly totalrainin: Range,
        public readonly uv: Range,
        public readonly vpd: Range,
        public readonly weeklyrainin: Range,
        public readonly wh65batt: Range,
        public readonly winddir: Range,
        public readonly windgustmph: Range,
        public readonly windspeedmph: Range,
        public readonly yearlyrainin: Range,
        public readonly recordCount: number,
        public readonly dateTimeRangeUtc: ReadOnlyDateTimeRange
    ) {
    }

    /**
     * Creates an AverageWeatherData object from an array of CurrentWeatherData objects.
     *
     * @param {CurrentWeatherData[]} weatherDataArray - An array of CurrentWeatherData objects to calculate averages from.
     * @return {AverageWeatherData} An AverageWeatherData object containing Range objects for each numeric property.
     */
    static Create(weatherDataArray: CurrentWeatherData[]): AverageWeatherData {
        if (!weatherDataArray || weatherDataArray.length === 0) {
            throw new Error('Cannot Create AverageWeatherData from empty array');
        }

        // Use the first item for string values
        const firstItem = weatherDataArray[0];
        const lastItem = weatherDataArray[weatherDataArray.length - 1];

        // Create a date time range from the timestamps in the data array
        const dateTimeRange = ReadOnlyDateTimeRange.Create(weatherDataArray.map(data => data.dateutc));

        return new AverageWeatherData(
            Range.create(weatherDataArray.map(data => data.baromabsin)),
            Range.create(weatherDataArray.map(data => data.baromrelin)),
            Range.create(weatherDataArray.map(data => data.dailyrainin)),
            Range.create(weatherDataArray.map(data => data.eventrainin)),
            firstItem.freq,
            Range.create(weatherDataArray.map(data => data.heap)),
            Range.create(weatherDataArray.map(data => data.hourlyrainin)),
            Range.create(weatherDataArray.map(data => data.humidity)),
            Range.create(weatherDataArray.map(data => data.humidityin)),
            Range.create(weatherDataArray.map(data => data.interval)),
            Range.create(weatherDataArray.map(data => data.maxdailygust)),
            firstItem.model,
            Range.create(weatherDataArray.map(data => data.monthlyrainin)),
            firstItem.PASSKEY,
            Range.create(weatherDataArray.map(data => data.rainratein)),
            lastItem.runtime,
            Range.create(weatherDataArray.map(data => data.solarradiation)),
            firstItem.stationtype,
            Range.create(weatherDataArray.map(data => data.tempf)),
            Range.create(weatherDataArray.map(data => data.tempinf)),
            Range.create(weatherDataArray.map(data => data.totalrainin)),
            Range.create(weatherDataArray.map(data => data.uv)),
            Range.create(weatherDataArray.map(data => data.vpd)),
            Range.create(weatherDataArray.map(data => data.weeklyrainin)),
            Range.create(weatherDataArray.map(data => data.wh65batt)),
            Range.create(weatherDataArray.map(data => data.winddir)),
            Range.create(weatherDataArray.map(data => data.windgustmph)),
            Range.create(weatherDataArray.map(data => data.windspeedmph)),
            Range.create(weatherDataArray.map(data => data.yearlyrainin)),
            weatherDataArray.length,
            dateTimeRange
        );
    }
}
