// QueryParser.ts
import * as querystring from 'querystring';

/**
 * QueryParser handles parsing and retrieval of parameters from an object.
 */
export class QueryParser {
    /**
     * Parses an object, converting string representations of numeric values to actual numbers,
     * and excluding keys named "uploadKey" (case-insensitive).
     *
     * @param {Record<string, any>} params - The input object to parse. Should be a key-value pair of strings or other values.
     * @return {Record<string, any>} A new object with numeric strings converted to numbers, and excluding "uploadKey".
     * @throws {Error} Throws an error if params is null.
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
     * Decodes a Base64-encoded string and parses it into an object.
     *
     * @param {string} base64Body - The Base64-encoded string to be decoded and parsed.
     * @return {Record<string, any>} The parsed object obtained from the decoded Base64 string.
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
     * Retrieves the value of a specific key from the provided parameters object.
     *
     * @param {Record<string, any>} params - The object containing key-value pairs.
     * @param {string} key - The key whose associated value is to be retrieved.
     * @return {any} The value associated with the matching key, or undefined if the key is not found.
     * @throws {Error} Throws an error if params is null, key is null, or key is empty.
     */
     getParam(params: Record<string, any>, key: string): any {
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
