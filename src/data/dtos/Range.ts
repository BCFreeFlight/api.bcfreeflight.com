/**
 * A class representing a numerical range with minimum, maximum, and average values.
 */
export class Range {
    /**
     * Creates an instance of a constructor with minimum, maximum, and average values.
     *
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @param {number} avg - The average value.
     */
    constructor(public readonly min: number,
                public readonly max: number,
                public readonly avg: number | null) {
    }

    /**
     * Creates a Range object based on the provided array of numbers.
     *
     * @param {number[]} numbers - An array of numbers to calculate the range, minimum, maximum, and average.
     * @return {Range} A Range object containing the calculated minimum, maximum, and average values.
     */
    static create(numbers: number[]): Range {
        const validValues = numbers.filter(v =>
            v !== null &&
            v !== undefined &&
            !Number.isNaN(v) &&
            Number.isFinite(v)
        );

        if (validValues.length === 0) {
            return new Range(0, 0, null); // or throw an error
        }

        const min = Math.min(...validValues);
        const max = Math.max(...validValues);
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        const avg = sum / validValues.length;

        return new Range(min, max, avg);
    }
}
