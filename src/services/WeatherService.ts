// WeatherService.ts
import {nanoid} from "nanoid";
import {IWeatherDataInput} from "../interfaces/IWeatherDataInput";
import {IWeatherRepository} from "../interfaces/IWeatherRepository";
import {DeviceInfo} from "../data/dtos/DeviceInfo";
import {CurrentWeatherData} from "../data/dtos/CurrentWeatherData";
import {WeatherRecord} from "../data/dtos/WeatherRecord";

/**
 * @inheritDoc
 */
export class WeatherService {
    private weatherRepository: IWeatherRepository;

    /**
     * @inheritDoc
     */
    constructor(weatherRepository: IWeatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    /**
     * @inheritDoc
     */
    async processAverages(): Promise<void> {
        await this.weatherRepository.processAverages();
    }

    /**
     * @inheritDoc
     */
    async saveWeatherData(
        device: DeviceInfo,
        data: CurrentWeatherData
    ): Promise<WeatherRecord> {
        const timestamp = new Date().toISOString();
        const id = nanoid();

        const payload: IWeatherDataInput = {
            id,
            device,
            timestamp,
            data,
        };

        return await this.weatherRepository.saveWeatherData(payload);
    }
}