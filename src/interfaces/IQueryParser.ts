// IQueryParser.ts

/**
 * Interface for QueryParser which handles parsing and retrieval of parameters from an object.
 */
export interface IQueryParser {
    /**
     * Parses an object, converting string representations of numeric values to actual numbers,
     * and excluding keys named "uploadKey" (case-insensitive).
     *
     * @param {Record<string, any>} params - The input object to parse. Should be a key-value pair of strings or other values.
     * @return {Record<string, any>} A new object with numeric strings converted to numbers, and excluding "uploadKey".
     * @throws {Error} Throws an error if params is null.
     */
    parse(params: Record<string, any>): Record<string, any>;

    /**
     * Decodes a Base64-encoded string and parses it into an object.
     *
     * @param {string} base64Body - The Base64-encoded string to be decoded and parsed.
     * @return {Record<string, any>} The parsed object obtained from the decoded Base64 string.
     */
    parseBase64(base64Body: string): Record<string, any>;

    /**
     * Retrieves the value of a specific key from the provided parameters object.
     *
     * @param {Record<string, any>} params - The object containing key-value pairs.
     * @param {string} key - The key whose associated value is to be retrieved.
     * @return {any} The value associated with the matching key, or undefined if the key is not found.
     * @throws {Error} Throws an error if params is null, key is null, or key is empty.
     */
    getParam(params: Record<string, any>, key: string): any;
}
