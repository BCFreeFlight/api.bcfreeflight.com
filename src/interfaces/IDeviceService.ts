// interfaces/IDeviceService.ts

/**
 * Interface describing the contract for device-related service operations.
 */
export interface IDeviceService {
    /**
     * Retrieves an entity by its unique identifier.
     *
     * @param {string} id - The unique identifier of the entity to retrieve.
     * @return {Promise<Record<string, any>|null>} A promise that resolves to the entity object if found, or null if not found.
     */
    getById(id: string): Promise<Record<string, any> | null>;
}

