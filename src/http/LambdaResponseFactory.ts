// LambdaResponseFactory.ts
import {IApiResponse} from "../interfaces/IApiResponse";
import {IResponseFactory} from "../interfaces/IResponseFactory";
import {ApiResponse} from "./ApiResponse";

/**
 * @inheritDoc
 */
export class LambdaResponseFactory implements IResponseFactory {
    /**
     * @inheritDoc
     */
    createApiResponse(statusCode: number, response: any): IApiResponse {
        const isPrimitive = response === null ||
            typeof response !== 'object';

        const responseBody = isPrimitive
            ? {response}
            : response;

        return new ApiResponse(statusCode, false, JSON.stringify(responseBody));
    }
}