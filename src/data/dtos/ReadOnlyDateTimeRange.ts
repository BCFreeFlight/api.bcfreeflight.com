/**
 * A class representing a date-time range with minimum and maximum timestamps.
 * This class is read-only and cannot be modified after creation.
 */
export class ReadOnlyDateTimeRange {
    /**
     * Creates an instance of ReadOnlyDateTimeRange with minimum and maximum timestamps.
     *
     * @param {string} min - The minimum timestamp in ISO format.
     * @param {string} max - The maximum timestamp in ISO format.
     */
    constructor(
        public readonly min: string,
        public readonly max: string
    ) {
    }

    /**
     * Creates a ReadOnlyDateTimeRange object based on the provided array of timestamps.
     *
     * @param {string[]} timestamps - An array of timestamps to determine the minimum and maximum values.
     * @return {ReadOnlyDateTimeRange} A ReadOnlyDateTimeRange object containing the calculated minimum and maximum timestamps.
     */
    static Create(timestamps: string[]): ReadOnlyDateTimeRange {
        if (!timestamps || timestamps.length === 0) {
            throw new Error('Cannot Create ReadOnlyDateTimeRange from empty array');
        }

        // Convert string timestamps to Date objects for comparison
        const dates = timestamps.map(ts => new Date(ts));
        
        // Find min and max dates
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        
        // Convert back to ISO string format
        return new ReadOnlyDateTimeRange(
            minDate.toISOString(),
            maxDate.toISOString()
        );
    }
}