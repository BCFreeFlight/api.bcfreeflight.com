// LambdaResponseFactory.ts
import {AwsLambdaApiResponse} from "./AwsLambdaApiResponse";

/**
 * Represents a factory class for creating AWS Lambda API response objects.
 */
export class AwsLambdaResponseFactory {

    /**
     * Creates an instance of AwsLambdaApiResponse with the provided status code and response.
     *
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {any} response - The response data to be sent back, which can be of any type.
     * @return {AwsLambdaApiResponse} The constructed API response object containing the status code, error flag, and stringified response body.
     */
    createApiResponse(statusCode: number, response: any): AwsLambdaApiResponse {
        const isPrimitive = response === null ||
            typeof response !== 'object';

        const responseBody = isPrimitive
            ? {response}
            : response;

        return new AwsLambdaApiResponse(statusCode, false, JSON.stringify(responseBody));
    }
}