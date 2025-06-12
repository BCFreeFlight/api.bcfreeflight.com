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
     * @return {void}
     */
    constructor(
        statusCode: number,
        isBase64Encoded: boolean,
        body: string
    ) {
        this._body = body;
        this._isBase64Encoded = isBase64Encoded;
        this._statusCode = statusCode;
    }

    /**
     * Retrieves the HTTP status code.
     *
     * @return {number} The HTTP status code representing the response status.
     */
    public get statusCode(): number {
        return this._statusCode;
    }

    /**
     * Checks if the current object is base64 encoded.
     *
     * @return {boolean} Returns true if the object is base64 encoded; otherwise, false.
     */
    public get isBase64Encoded(): boolean {
        return this._isBase64Encoded;
    }

    /**
     * Gets the value of the body.
     *
     * @return {string} The current value of the body.
     */
    public get body(): string {
        return this._body;
    }

    /**
     * Retrieves the headers associated with the current instance.
     *
     * @return {Record<string, string>} The headers as a key-value pair object.
     */
    public get headers(): Record<string, string> {
        return this._headers;
    }

    private readonly _statusCode: number;
    private readonly _isBase64Encoded: boolean;
    private readonly _body: string;
    private readonly _headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
}