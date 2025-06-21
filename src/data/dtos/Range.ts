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
                public readonly avg: number) {
    }

    /**
     * Creates a Range object based on the provided array of numbers.
     *
     * @param {number[]} numbers - An array of numbers to calculate the range, minimum, maximum, and average.
     * @return {Range} A Range object containing the calculated minimum, maximum, and average values.
     */
    static create(numbers: number[]): Range {
        return new Range(Math.min(...numbers),
            Math.max(...numbers),
            numbers.reduce((a, b) => a + b, 0) / numbers.length);
    }
}
