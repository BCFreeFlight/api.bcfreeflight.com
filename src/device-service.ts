// device-service.ts
import { DeviceRepository } from './types/interfaces';

/**
 * Service class responsible for handling device-related operations.
 */
class DeviceService {
    private deviceRepository: DeviceRepository;

    /**
     * Constructs an instance of the class with a specified device repository.
     *
     * @param {DeviceRepository} deviceRepository - The repository instance used to manage device-related data and operations.
     * @return {void}
     */
    constructor(deviceRepository: DeviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /**
     * Retrieves an entity by its unique identifier.
     *
     * @param {string} id - The unique identifier of the entity to retrieve.
     * @return {Promise<Record<string, any>|null>} A promise that resolves to the entity object if found, or null if not found.
     */
    async getById(id: string): Promise<Record<string, any> | null> {
        return await this.deviceRepository.findById(id);
    }
}

export { DeviceService };
