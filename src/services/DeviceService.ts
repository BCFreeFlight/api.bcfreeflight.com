// DeviceService.ts
import {AwsDynamoDBDeviceRepository} from '../data/AwsDynamoDBDeviceRepository';
import {DeviceInfo} from "../data/dtos/DeviceInfo";

/**
 * Service for device-related operations.
 */
export class DeviceService {

    /**
     * Creates a new instance of DeviceService.
     * 
     * @param {AwsDynamoDBDeviceRepository} deviceRepository - The repository used to access device data.
     */
    constructor(deviceRepository: AwsDynamoDBDeviceRepository) {
        this._deviceRepository = deviceRepository;
    }

    /**
     * Retrieves an entity by its unique identifier.
     *
     * @param {string} id - The unique identifier of the entity to retrieve.
     * @return {Promise<Record<string, any>|null>} A promise that resolves to the entity object if found, or null if not found.
     */
    async getById(id: string): Promise<DeviceInfo | null> {
        console.log(`Starting getById method for device ${id}`);
        console.log(`Calling deviceRepository.findById for device ${id}`);
        const device = await this._deviceRepository.findById(id);
        if (device) {
            console.log(`Successfully retrieved device ${id}`);
        } else {
            console.log(`Device ${id} not found`);
        }
        return device;
    }

    private readonly _deviceRepository: AwsDynamoDBDeviceRepository;
}
