// WeatherService.ts
import {nanoid} from "nanoid";
import {DeviceInfo} from "../data/dtos/DeviceInfo";
import {CurrentWeatherData} from "../data/dtos/CurrentWeatherData";
import {AwsDynamoDBWeatherRepository} from "../data/AwsDynamoDBWeatherRepository";
import {WeatherRecord} from "../data/dtos/WeatherRecord";
import {AverageWeatherData} from "../data/dtos/AverageWeatherData";

/**
 * Service for weather-related operations.
 */
export class WeatherService {

    /**
     * Creates a new instance of WeatherService.
     *
     * @param {AwsDynamoDBWeatherRepository} weatherRepository - The repository used to access weather data.
     */
    constructor(weatherRepository: AwsDynamoDBWeatherRepository) {
        this._weatherRepository = weatherRepository;
    }

    /**
     * Processes and computes averages based on a predefined dataset or input.
     * Performs necessary calculations asynchronously.
     *
     * @return {Promise<void>} A promise that resolves when the processing is complete.
     */
    async ProcessAverages(): Promise<void> {
        // list all records in the table
        const current = await this._weatherRepository.ListAll();

        // group the records by deviceId
        const groupedByDevice = current.reduce((groups, record) => {
            const deviceId = record.device.id;
            if (!groups[deviceId]) {
                groups[deviceId] = [];
            }
            groups[deviceId].push(record);
            return groups;
        }, {} as Record<string, typeof current>);

        let processed: string[] = [];
        for (const [deviceId, records] of Object.entries(groupedByDevice)) {
            console.log(`Device ${deviceId} has ${records.length} current records`);
            const averageWeather = AverageWeatherData.create(records.map(x => x.data));
            const id = nanoid();
            const payload = new WeatherRecord<AverageWeatherData>(id, records[0].timestamp, averageWeather, records[0].device);
            await this._weatherRepository.SaveAverage(payload);
            const ids = records.map(x => x.id);
            processed = processed.concat(ids);
        }

        await this._weatherRepository.DeleteAll(processed);
    }

    /**
     * Saves weather data to the database or designated storage system.
     *
     * @param {DeviceInfo} device - Details of the device that collected the weather data.
     * @param {CurrentWeatherData} data - The actual weather data readings.
     * @return {Promise<WeatherRecord<CurrentWeatherData>>} A promise that resolves to a confirmation object containing details of the saved data.
     */
    async SaveCurrent(
        device: DeviceInfo,
        data: CurrentWeatherData
    ): Promise<string> {
        const timestamp = new Date().toISOString();
        const id = nanoid();
        const payload = new WeatherRecord<CurrentWeatherData>(
            id, timestamp,
            data,
            device
        );

        return await this._weatherRepository.SaveCurrent(payload);
    }

    private readonly _weatherRepository: AwsDynamoDBWeatherRepository;
}
