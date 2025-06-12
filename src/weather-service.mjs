// weather-service.mjs
import {nanoid} from "nanoid";


/**
 * A service for managing and storing weather data.
 */
class WeatherService {
    /**
     * Creates an instance of the class with the given weather repository.
     *
     * @param {Object} weatherRepository - The repository instance used to fetch weather data.
     * @return {Object} An instance of the class initialized with the provided weather repository.
     */
    constructor(weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    /**
     * Saves weather data to the repository with a unique identifier and timestamp.
     *
     * @param {object} device - The device submitting the upload.
     * @param {Object} data - The weather data to be saved.
     * @return {Promise<void>} A promise that resolves when the data is successfully saved.
     */
    async saveWeatherData(device, data) {
        const timestamp = new Date().toISOString();
        const id = nanoid();
        return await this.weatherRepository.saveWeatherData({id, device, timestamp, data});
    }
}

export { WeatherService };