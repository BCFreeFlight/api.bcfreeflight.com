import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

/**
 * A repository interface for interacting with a table containing device data.
 * This interface provides a method to get devices by their id.
 */
export interface IDeviceRepository {
    /**
     * Finds and retrieves the record associated with the provided id from the table.
     * The uploadKey parameter is now treated as the table's id column.
     *
     * @param {string} id - The id of the record to retrieve (previously this was the upload key).
     * @return {Promise<Record<string, any>|null>} A promise that resolves to the retrieved item or null if not found.
     * @throws {Error} Throws an error if the uploadKey (id) is not provided.
     */
    findById(id: string): Promise<Record<string, any> | null>;
}
