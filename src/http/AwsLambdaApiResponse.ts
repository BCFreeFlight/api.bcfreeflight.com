/**
 * Represents the response structure for an AWS Lambda API Gateway response.
 * This class encapsulates the necessary components needed to construct
 * an HTTP response as required by AWS Lambda API Gateway integrations.
 */
export class AwsLambdaApiResponse {

    /**
     * Constructs an instance with the given status code, base64 encoding flag, and response body.
     *
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {boolean} isBase64Encoded - Indicates whether the response body is base64 encoded.
     * @param {string} body - The response body content.
     */
    constructor(
        public readonly statusCode: number,
        public readonly isBase64Encoded: boolean,
        public readonly body: string
    ) {
    }

    public readonly headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
}