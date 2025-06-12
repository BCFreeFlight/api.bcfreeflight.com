// weather-service.ts
import { nanoid } from "nanoid";
import { WeatherRepository } from "./types/interfaces";

/**
 * A service for managing and storing weather data.
 */
class WeatherService {
    private weatherRepository: WeatherRepository;

    /**
     * Creates an instance of the class with the given weather repository.
     *
     * @param {WeatherRepository} weatherRepository - The repository instance used to fetch weather data.
     * @return {void}
     */
    constructor(weatherRepository: WeatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    /**
     * Saves weather data to the repository with a unique identifier and timestamp.
     *
     * @param {Record<string, any>} device - The device submitting the upload.
     * @param {Record<string, any>} data - The weather data to be saved.
     * @return {Promise<Record<string, any>>} A promise that resolves with the saved data.
     */
    async saveWeatherData(device: Record<string, any>, data: Record<string, any>): Promise<Record<string, any>> {
        const timestamp = new Date().toISOString();
        const id = nanoid();
        return await this.weatherRepository.saveWeatherData({id, device, timestamp, data});
    }
}

export { WeatherService };
