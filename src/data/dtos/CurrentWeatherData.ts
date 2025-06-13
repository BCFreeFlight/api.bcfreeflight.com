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
        baromabsin: number,
        baromrelin: number,
        dailyrainin: number,
        dateutc: string,
        eventrainin: number,
        freq: string,
        heap: number,
        hourlyrainin: number,
        humidity: number,
        humidityin: number,
        interval: number,
        maxdailygust: number,
        model: string,
        monthlyrainin: number,
        PASSKEY: string,
        rainratein: number,
        runtime: number,
        solarradiation: number,
        stationtype: string,
        tempf: number,
        tempinf: number,
        totalrainin: number,
        uv: number,
        vpd: number,
        weeklyrainin: number,
        wh65batt: number,
        winddir: number,
        windgustmph: number,
        windspeedmph: number,
        yearlyrainin: number
    ) {
        this._baromabsin = baromabsin;
        this._baromrelin = baromrelin;
        this._dailyrainin = dailyrainin;
        this._dateutc = dateutc;
        this._eventrainin = eventrainin;
        this._freq = freq;
        this._heap = heap;
        this._hourlyrainin = hourlyrainin;
        this._humidity = humidity;
        this._humidityin = humidityin;
        this._interval = interval;
        this._maxdailygust = maxdailygust;
        this._model = model;
        this._monthlyrainin = monthlyrainin;
        this._PASSKEY = PASSKEY;
        this._rainratein = rainratein;
        this._runtime = runtime;
        this._solarradiation = solarradiation;
        this._stationtype = stationtype;
        this._tempf = tempf;
        this._tempinf = tempinf;
        this._totalrainin = totalrainin;
        this._uv = uv;
        this._vpd = vpd;
        this._weeklyrainin = weeklyrainin;
        this._wh65batt = wh65batt;
        this._winddir = winddir;
        this._windgustmph = windgustmph;
        this._windspeedmph = windspeedmph;
        this._yearlyrainin = yearlyrainin;
    }

    /**
     * Absolute atmospheric pressure in inches.
     */
    public get baromabsin() {
        return this._baromabsin;
    }

    /**
     * Relative atmospheric pressure in inches.
     */
    public get baromrelin() {
        return this._baromrelin;
    }

    /**
     * Daily rainfall amount in inches.
     */
    public get dailyrainin() {
        return this._dailyrainin;
    }

    /**
     * UTC date and time in string format.
     */
    public get dateutc() {
        return this._dateutc;
    }

    /**
     * Rainfall amount for a specific event in inches.
     */
    public get eventrainin() {
        return this._eventrainin;
    }

    /**
     * Frequency of data reporting.
     */
    public get freq() {
        return this._freq;
    }

    /**
     * System heap memory usage.
     */
    public get heap() {
        return this._heap;
    }

    /**
     * Hourly rainfall amount in inches.
     */
    public get hourlyrainin() {
        return this._hourlyrainin;
    }

    /**
     * Outdoor humidity percentage.
     */
    public get humidity() {
        return this._humidity;
    }

    /**
     * Indoor humidity percentage.
     */
    public get humidityin() {
        return this._humidityin;
    }

    /**
     * Data reporting interval in seconds.
     */
    public get interval() {
        return this._interval;
    }

    /**
     * Maximum gust speed for the day in miles per hour.
     */
    public get maxdailygust() {
        return this._maxdailygust;
    }

    /**
     * Model of the weather station.
     */
    public get model() {
        return this._model;
    }

    /**
     * Monthly rainfall amount in inches.
     */
    public get monthlyrainin() {
        return this._monthlyrainin;
    }

    /**
     * Unique key associated with the weather station.
     */
    public get PASSKEY() {
        return this._PASSKEY;
    }

    /**
     * Rain rate in inches per hour.
     */
    public get rainratein() {
        return this._rainratein;
    }

    /**
     * System runtime in seconds.
     */
    public get runtime() {
        return this._runtime;
    }

    /**
     * Solar radiation in watts per square meter.
     */
    public get solarradiation() {
        return this._solarradiation;
    }

    /**
     * Type of the weather station.
     */
    public get stationtype() {
        return this._stationtype;
    }

    /**
     * Outdoor temperature in Fahrenheit.
     */
    public get tempf() {
        return this._tempf;
    }

    /**
     * Indoor temperature in Fahrenheit.
     */
    public get tempinf() {
        return this._tempinf;
    }

    /**
     * Total rainfall amount in inches.
     */
    public get totalrainin() {
        return this._totalrainin;
    }

    /**
     * Ultraviolet index measurement.
     */
    public get uv() {
        return this._uv;
    }

    /**
     * Vapor pressure deficit in millibars.
     */
    public get vpd() {
        return this._vpd;
    }

    /**
     * Weekly rainfall amount in inches.
     */
    public get weeklyrainin() {
        return this._weeklyrainin;
    }

    /**
     * Battery status for the WH65 sensor.
     */
    public get wh65batt() {
        return this._wh65batt;
    }

    /**
     * Wind direction in degrees.
     */
    public get winddir() {
        return this._winddir;
    }

    /**
     * Wind gust speed in miles per hour.
     */
    public get windgustmph() {
        return this._windgustmph;
    }

    /**
     * Wind speed in miles per hour.
     */
    public get windspeedmph() {
        return this._windspeedmph;
    }

    /**
     * Yearly rainfall amount in inches.
     */
    public get yearlyrainin() {
        return this._yearlyrainin;
    }

    private readonly _baromabsin: number;
    private readonly _baromrelin: number;
    private readonly _dailyrainin: number;
    private readonly _dateutc: string;
    private readonly _eventrainin: number;
    private readonly _freq: string;
    private readonly _heap: number;
    private readonly _hourlyrainin: number;
    private readonly _humidity: number;
    private readonly _humidityin: number;
    private readonly _interval: number;
    private readonly _maxdailygust: number;
    private readonly _model: string;
    private readonly _monthlyrainin: number;
    private readonly _PASSKEY: string;
    private readonly _rainratein: number;
    private readonly _runtime: number;
    private readonly _solarradiation: number;
    private readonly _stationtype: string;
    private readonly _tempf: number;
    private readonly _tempinf: number;
    private readonly _totalrainin: number;
    private readonly _uv: number;
    private readonly _vpd: number;
    private readonly _weeklyrainin: number;
    private readonly _wh65batt: number;
    private readonly _winddir: number;
    private readonly _windgustmph: number;
    private readonly _windspeedmph: number;
    private readonly _yearlyrainin: number;
}