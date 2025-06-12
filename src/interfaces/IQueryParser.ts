// IQueryParser.ts

type Params = Record<string, any>;

/**
 * Interface for QueryParser which handles parsing and retrieval of parameters from an object.
 */
export interface IQueryParser {
    /**
     * Parses an object, converting string representations of numeric values to actual numbers,
     * and excluding keys named "uploadKey" (case-insensitive).
     *
     * @param {Params} params - The input object to parse. Should be a key-value pair of strings or other values.
     * @return {Params} A new object with numeric strings converted to numbers, and excluding "uploadKey".
     * @throws {Error} Throws an error if params is null.
     */
    parse(params: Params): Params;

    /**
     * Decodes a Base64-encoded string and parses it into an object.
     *
     * @param {string} base64Body - The Base64-encoded string to be decoded and parsed.
     * @return {Params} The parsed object obtained from the decoded Base64 string.
     */
    parseBase64(base64Body: string): Params;

    /**
     * Retrieves the value of a specific key from the provided parameters object.
     *
     * @param {Params} params - The object containing key-value pairs.
     * @param {string} key - The key whose associated value is to be retrieved.
     * @return {any} The value associated with the matching key, or undefined if the key is not found.
     * @throws {Error} Throws an error if params is null, key is null, or key is empty.
     */
    getParam(params: Params, key: string): any;
}
