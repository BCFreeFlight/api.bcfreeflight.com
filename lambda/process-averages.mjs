// index.mjs
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AwsLambdaResponseFactory, AwsDynamoDBWeatherRepository, WeatherService} from "bcfreeflight";

// Table names
const liveWeather = "BCFF_LiveWeather";
const averageWeather = "BCFF_Weather";

// Create dependencies
const dbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const responseFactory = new AwsLambdaResponseFactory();
const weatherRepository = new AwsDynamoDBWeatherRepository(dbClient, liveWeather, averageWeather);
const weatherService = new WeatherService(weatherRepository);

/**
 * Lambda handler that processes weather averages.
 * This function loads all data from the BCFF_LiveWeather table,
 * creates a single record with all the averages, saves it to the BCFF_Weather table,
 * and then deletes all the processed records from the BCFF_LiveWeather table.
 *
 * @param {Object} event - The AWS Lambda event object
 * @return {Promise<Object>} Returns a formatted HTTP response object with a status code and message
 */
const handler = async (event) => {
    try {
        await weatherService.ProcessAverages();
        return responseFactory.createApiResponse(200, "Successfully processed weather averages");
    } catch (err) {
        return responseFactory.createApiResponse(500, `Internal server error: ${err.message}`);
    }
};

export {handler};
