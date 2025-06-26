// get-weather.mjs
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AwsLambdaResponseFactory, QueryParser, AwsDynamoDBWeatherRepository, WeatherService} from "bcfreeflight";

// Table names
const liveWeather = "BCFF_LiveWeather";
const averageWeather = "BCFF_Weather";

// Create dependencies
const dbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const responseFactory = new AwsLambdaResponseFactory();
const queryParser = new QueryParser();
const weatherRepository = new AwsDynamoDBWeatherRepository(dbClient, liveWeather, averageWeather);
const weatherService = new WeatherService(weatherRepository);

// Lambda handler
/**
 * Handles an HTTP request to retrieve weather data for a specific device.
 *
 * @param {Object} event - The event object containing details of the HTTP request, including queryStringParameters.
 * @return {Promise<Object>} Returns a formatted HTTP response object with a status code and payload.
 *                           A 200 status code is returned if the operation is successful, with the weather data in the payload.
 *                           A 400 status code is returned if the `deviceId` is missing.
 *                           Throws an error with a 500 status code for internal server errors.
 */
const handler = async (event) => {
    console.log("Starting get-weather handler");

    console.log("Extracting deviceId from query parameters");
    const deviceId = queryParser.getParam(event.queryStringParameters, "deviceId");

    if (!deviceId) {
        console.log("Error: Missing 'deviceId' in query string");
        return responseFactory.createApiResponse(400, "Missing 'deviceId' in query string.");
    }

    console.log("Extracting optional localDate from query parameters");
    const localDate = queryParser.getParam(event.queryStringParameters, "localDate");
    if (localDate) {
        console.log(`localDate parameter provided: ${localDate}`);
    } else {
        console.log("No localDate parameter provided, will return most recent data");
    }

    try {
        console.log(`Retrieving weather data for device: ${deviceId}`);
        const weatherResults = await weatherService.Get(deviceId, localDate);
        console.log(`Retrieved ${weatherResults.length} weather results`);

        console.log("Get-weather handler completed successfully");
        return weatherResults;
    } catch (err) {
        console.error("Error in get-weather handler:", err);
        return responseFactory.createApiResponse(500, `Internal server error: ${err.message}`);
    } finally {
        console.log("Completed get-weather handler");
    }
};

export {handler};
