import {IApiResponse} from "./interfaces/IApiResponse";

/**
 * @inheritdoc
 */
class ApiResponse implements IApiResponse {
    constructor(
        public statusCode: number,
        public isBase64Encoded: boolean,
        public body: string
    ) {
    }

    public headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
}

export {ApiResponse};
