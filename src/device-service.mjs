// device-service.mjs
/**
 * Service class responsible for handling device-related operations.
 */
class DeviceService {
    /**
     * Constructs an instance of the class with a specified device repository.
     *
     * @param {Object} deviceRepository - The repository instance used to manage device-related data and operations.
     * @return {void}
     */
    constructor(deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /**
     * Retrieves an entity by its unique identifier.
     *
     * @param {string|number} id - The unique identifier of the entity to retrieve.
     * @return {Promise<Object|null>} A promise that resolves to the entity object if found, or null if not found.
     */
    async getById(id) {
        return await this.deviceRepository.findById(id);
    }
}

export { DeviceService };