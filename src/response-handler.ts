// response-handler.ts

interface HttpResponse {
    statusCode: number;
    isBase64Encoded: boolean;
    body: string;
    headers: Record<string, string>;
}

/**
 * A class dedicated to creating and formatting HTTP response objects.
 */
class ResponseHandler {
    /**
     * Formats a response object with the provided status code and optional message.
     *
     * @param {number} statusCode - The HTTP status code for the response.
     * @param {any} response - The message to include in the response body.
     * @return {HttpResponse} The formatted response object containing the status code, JSON stringified body, and headers.
     */
    handle(statusCode: number, response: any): HttpResponse {
        const isPrimitive = response === null || 
            typeof response !== 'object';

        const responseBody = isPrimitive 
            ? { response } 
            : response;

        return {
            statusCode: statusCode,
            isBase64Encoded: false,
            body: JSON.stringify(responseBody),
            headers: {
                "Content-Type": "application/json"
            }
        };
    }
}

export { ResponseHandler };
