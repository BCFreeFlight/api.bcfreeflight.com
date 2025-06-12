// ResponseHandler.ts
import {IApiResponse} from "./interfaces/IApiResponse";
import {IResponseHandler} from "./interfaces/IResponseHandler";
import {ApiResponse} from "./ApiResponse";

/**
 * @inheritDoc
 */
class ResponseHandler implements IResponseHandler {
    /**
     * @inheritDoc
     */
    handle(statusCode: number, response: any): IApiResponse {
        const isPrimitive = response === null ||
            typeof response !== 'object';

        const responseBody = isPrimitive
            ? {response}
            : response;

        return new ApiResponse(statusCode, false, JSON.stringify(responseBody));
    }
}

export {ResponseHandler, ApiResponse};
