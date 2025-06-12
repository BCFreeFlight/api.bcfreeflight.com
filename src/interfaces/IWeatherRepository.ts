/**
 * Interface representing a repository for managing weather data.
 */
export interface IWeatherRepository {
    /**
     * Saves weather data to the database or designated storage system.
     *
     * @param {Object} params - The parameters for the weather data to be saved.
     * @param {string} params.id - The unique identifier for the weather data entry.
     * @param {Object} params.device - Details of the device that collected the weather data.
     * @param {string} params.timestamp - The timestamp when the data was collected.
     * @param {Object} params.data - The actual weather data readings.
     * @return {Promise<Object>} A promise that resolves to a confirmation object containing details of the saved data.
     */
    saveWeatherData(params: {
        id: string;
        device: Record<string, any>;
        timestamp: string;
        data: Record<string, any>;
    }): Promise<Record<string, any>>;
}