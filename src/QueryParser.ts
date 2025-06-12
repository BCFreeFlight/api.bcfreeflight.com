// QueryParser.ts
import * as querystring from 'querystring';
import {IQueryParser} from './interfaces/IQueryParser';

/**
 * @inheritdoc
 */
class QueryParser implements IQueryParser {
    /**
     * @inheritdoc
     */
    parse(params: Record<string, any>): Record<string, any> {
        if (params === null) throw new Error("params cannot be null");
        if (typeof params !== 'object') return {};

        const parsed: Record<string, any> = {};
        for (const [key, value] of Object.entries(params)) {
            this.toDictionary(key, value, parsed);
        }
        return parsed;
    }


    /**
     * @inheritdoc
     */
    parseBase64(base64Body: string): Record<string, any> {
        try {
            if (!base64Body) return {};

            const decoded = Buffer.from(base64Body, 'base64').toString('utf-8');
            const parsedRaw = querystring.parse(decoded);

            const parsed: Record<string, any> = {};
            for (const [key, value] of Object.entries(parsedRaw)) {
                this.toDictionary(key, value, parsed);
            }

            return parsed;
        } catch (e) {
            throw new Error("Unable to parse base64 body");
        }
    }

    /**
     * @inheritdoc
     */
    private getParam(params: Record<string, any>, key: string): any {
        if (params === null) throw new Error("params cannot be null");
        if (key === null) throw new Error("key cannot be null");
        if (key === "") throw new Error("key cannot be empty");
        if (typeof params !== 'object') throw new Error("params must be an object");

        const foundKey = Object.keys(params).find(k => k.toLowerCase() === key.toLowerCase());
        return foundKey ? params[foundKey] : undefined;
    }

    private toDictionary = (key: string, value: string | string[] | undefined, parsed: Record<string, any>) => {
        if (key.toLowerCase() === 'uploadkey') return;
        if (typeof value === 'string') {
            const numberVal = parseFloat(value);
            parsed[key] = !isNaN(numberVal) && value.trim() === numberVal.toString()
                ? numberVal
                : value;
        } else {
            parsed[key] = value;
        }
    }
}

export {QueryParser};
