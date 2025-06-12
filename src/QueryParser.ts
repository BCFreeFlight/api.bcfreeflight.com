// QueryParser.ts
import * as querystring from 'querystring';
import {IQueryParser} from './interfaces/IQueryParser';

type Params = Record<string, any>;

/**
 * @inheritdoc
 */
class QueryParser implements IQueryParser {
    /**
     * @inheritdoc
     */
    parse(params: Params): Params {
        if (params === null) throw new Error("params cannot be null");
        if (typeof params !== 'object') return {};

        const parsed: Params = {};
        for (const [key, value] of Object.entries(params)) {
            this.toDictionary(key, value, parsed);
        }
        return parsed;
    }


    /**
     * @inheritdoc
     */
    parseBase64(base64Body: string): Params {
        try {
            if (!base64Body) return {};

            const decoded = Buffer.from(base64Body, 'base64').toString('utf-8');
            const parsedRaw = querystring.parse(decoded);

            const parsed: Params = {};
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
    getParam(params: Params, key: string): any {
        if (params === null) throw new Error("params cannot be null");
        if (key === null) throw new Error("key cannot be null");
        if (key === "") throw new Error("key cannot be empty");
        if (typeof params !== 'object') throw new Error("params must be an object");

        const foundKey = Object.keys(params).find(k => k.toLowerCase() === key.toLowerCase());
        return foundKey ? params[foundKey] : undefined;
    }

    private toDictionary = (key: string, value: string | string[] | undefined, parsed: Params) => {
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
