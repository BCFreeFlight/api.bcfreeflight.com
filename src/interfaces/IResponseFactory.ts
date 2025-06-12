import { IApiResponse } from "./IApiResponse";

/**
 * Interface for handling API responses.
 *
 * This interface defines the contract for classes that transform
 * raw response data into structured API responses.
 */
export interface IResponseFactory {
    /**
     * Handles the raw response data and converts it to a structured API response.
     *
     * @param statusCode - The HTTP status code to include in the response.
     * @param response - The raw response data to be processed.
     * @returns A structured API response object.
     */
    createApiResponse(statusCode: number, response: any): IApiResponse;
}
