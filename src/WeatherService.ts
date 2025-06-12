// WeatherService.ts
import {nanoid} from "nanoid";
import {IWeatherDataInput} from "./interfaces/IWeatherDataInput";
import {IWeatherRepository} from "./interfaces/IWeatherRepository";

/**
 * @inheritDoc
 */
class WeatherService {
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
    async saveWeatherData(
        device: Record<string, any>,
        data: Record<string, any>
    ): Promise<Record<string, any>> {
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

export {WeatherService};