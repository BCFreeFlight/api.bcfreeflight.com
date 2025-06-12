import {IApiResponse} from "../interfaces/IApiResponse";

/**
 * @inheritdoc
 */
export class ApiResponse implements IApiResponse {
    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    get statusCode(): number {
        return this._statusCode;
    }
    /**
     * @inheritdoc
     */
    get isBase64Encoded(): boolean {
        return this._isBase64Encoded;
    }
    /**
     * @inheritdoc
     */
    get body(): string {
        return this._body;
    }
    /**
     * @inheritdoc
     */
    get headers(): Record<string, string> {
        return this._headers;
    }

    private readonly _statusCode: number;
    private readonly _isBase64Encoded: boolean;
    private readonly _body: string;
    private readonly _headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
}