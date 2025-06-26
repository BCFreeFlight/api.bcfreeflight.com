// WeatherService.ts
import {DeviceInfo} from "../data/dtos/DeviceInfo";
import {CurrentWeatherData} from "../data/dtos/CurrentWeatherData";
import {AwsDynamoDBWeatherRepository} from "../data/AwsDynamoDBWeatherRepository";
import {WeatherRecord} from "../data/dtos/WeatherRecord";
import {AverageWeatherData} from "../data/dtos/AverageWeatherData";
import {WeatherResult} from "../data/dtos/WeatherResult";

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
        console.log("Starting ProcessAverages method");

        // list all records in the table
        console.log("Fetching current weather records from repository");
        const current = await this._weatherRepository.ListCurrent();
        console.log(`Retrieved ${current.length} weather records`);

        // group the records by deviceId
        console.log("Grouping records by deviceId");
        const groupedByDevice = current.reduce((groups, record) => {
            const deviceId = record.deviceId;
            if (!groups[deviceId]) {
                groups[deviceId] = [];
            }
            groups[deviceId].push(record);
            return groups;
        }, {} as Record<string, typeof current>);
        console.log(`Grouped records into ${Object.keys(groupedByDevice).length} devices`);

        let processed: string[] = [];
        console.log("Starting to process each device group");
        for (const [deviceId, records] of Object.entries(groupedByDevice)) {
            console.log(`Processing device ${deviceId} with ${records.length} records`);

            console.log("Creating average weather data");
            const averageWeather = AverageWeatherData.Create(records.map(x => x.data));

            console.log("Creating weather record payload");
            const payload = WeatherRecord.Create<AverageWeatherData>(averageWeather, records[0].device);

            console.log(`Saving average weather data for device ${deviceId}`);
            await this._weatherRepository.SaveAverage(payload);
            console.log(`Successfully saved average for device ${deviceId}`);

            processed.push(deviceId);
            console.log(`Added ${deviceId} to processed list`);
        }
        console.log(`Completed processing ${processed.length} devices`);

        console.log(`Deleting ${current.length - processed.length} records from the database...`);
        console.log("Processed devices:", processed);
        console.log("Calling DeleteAll on repository");
        await this._weatherRepository.DeleteAll(processed);
        console.log("Successfully deleted processed records");

        console.log("ProcessAverages method completed successfully");
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
    ): Promise<void> {
        console.log(`Starting SaveCurrent method for device ${device.id}`);
        console.log("Creating weather record payload");
        const payload = WeatherRecord.Create<CurrentWeatherData>(data, device);
        console.log("Weather record payload created:", payload);
        console.log(`Saving current weather data for device ${device.id}`);
        await this._weatherRepository.SaveCurrent(payload);
        console.log(`Successfully saved current weather data for device ${device.id}`);
    }

    /**
     * Gets weather data for a specific device, either the most recent record or records for a specific date.
     * The data is transformed into a simplified WeatherResult format that contains only deviceId and data.
     *
     * @param {string} deviceId - The ID of the device to retrieve weather data for.
     * @param {string} [localDate] - Optional. The local date to retrieve weather data for in MM-DD-YYYY format.
     * @return {Promise<WeatherResult[]>} A promise that resolves to an array of weather results.
     *         If a localDate is provided, returns all records for that date. Otherwise, returns only the most recent record.
     */
    async Get(deviceId: string, localDate?: string): Promise<WeatherResult[]> {
        console.log(`Starting Get method for device ${deviceId}${localDate ? ` and date ${localDate}` : ''}`);

        let records: WeatherRecord<AverageWeatherData>[];

        if (localDate) {
            console.log(`Retrieving weather data for device ${deviceId} on date ${localDate}`);
            records = await this._weatherRepository.List(deviceId, localDate);
            console.log(`Retrieved ${records.length} records for device ${deviceId} on date ${localDate}`);
        } else {
            console.log(`Retrieving most recent weather data for device ${deviceId}`);
            records = await this._weatherRepository.Get(deviceId);
            console.log(`Retrieved ${records.length} records for device ${deviceId}`);
        }

        // Transform WeatherRecord array into WeatherResult array
        console.log(`Transforming ${records.length} records to WeatherResult format`);
        const results = records.map(record => new WeatherResult(record.deviceId, record.data));
        console.log(`Transformation complete, returning ${results.length} WeatherResult objects`);

        return results;
    }

    private readonly _weatherRepository: AwsDynamoDBWeatherRepository;
}
