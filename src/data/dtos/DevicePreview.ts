/**
 * Represents a preview of a device with its related geographical and environmental information.
 */
export class DevicePreview {
    /**
     * Creates an instance of the class with specified properties.
     *
     * @param {string} name - The name of the entity or location.
     * @param {string} location - The geographical location of the entity.
     * @param {string} timezone - The timezone of the specified location.
     * @param {number} elevation - The elevation of the entity or location above sea level.
     * @param {number} height - The height attribute of the entity or structure.
     * @param {number} latitude - The geographical latitude of the location.
     * @param {number} longitude - The geographical longitude of the location.
     */
    constructor(
        public readonly name: string, 
        public readonly location: string, 
        public readonly timezone: string, 
        public readonly elevation: number, 
        public readonly height: number, 
        public readonly latitude: number, 
        public readonly longitude: number
    ) {}
}
