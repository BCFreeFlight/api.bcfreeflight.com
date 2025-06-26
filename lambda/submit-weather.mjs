// submit-weather.mjs
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AwsLambdaResponseFactory, QueryParser, AwsDynamoDBDeviceRepository, AwsDynamoDBWeatherRepository, WeatherService, DeviceService} from "bcfreeflight";

// Table names
const deviceTable = "BCFF_Devices";
const liveWeather = "BCFF_LiveWeather";
const averageWeather = "BCFF_Weather";

// Create dependencies
const dbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const responseFactory = new AwsLambdaResponseFactory();
const queryParser = new QueryParser();
const deviceRepository = new AwsDynamoDBDeviceRepository(dbClient, deviceTable);
const weatherRepository = new AwsDynamoDBWeatherRepository(dbClient, liveWeather, averageWeather);
const weatherService = new WeatherService(weatherRepository);
const deviceService = new DeviceService(deviceRepository);

// Lambda handler
/**
 * Handles an HTTP request to validate a device and save weather data based on the provided query parameters.
 *
 * @param {Object} event - The event object containing details of the HTTP request, including queryStringParameters.
 * @return {Promise<Object>} Returns a formatted HTTP response object with a status code and message.
 *                           A 200 status code is returned if the operation is successful.
 *                           A 400 status code is returned if the `uploadKey` is missing or invalid.
 *                           Throws an error with a 500 status code for internal server errors.
 */
const handler = async (event) => {
    console.log("Starting submit-weather handler");

    console.log("Extracting uploadKey from query parameters");
    const uploadKey = queryParser.getParam(event.queryStringParameters, "uploadKey");

    if (!uploadKey) {
        console.log("Error: Missing 'uploadKey' in query string");
        return responseFactory.createApiResponse(400, "Missing 'uploadKey' in query string.");
    }

    try {
        console.log(`Looking up device with uploadKey: ${uploadKey}`);
        const device = await deviceService.getById(uploadKey);
        if (!device) {
            console.log(`Error: Device with key '${uploadKey}' not found`);
            return responseFactory.createApiResponse(400, `Device with key '${uploadKey}' not found.`);
        }
        console.log(`Device found: ${device.name}`);

        console.log("Parsing weather payload");
        const payload = event.isBase64Encoded
            ? queryParser.parseBase64(event.body)
            : queryParser.parse(event.queryStringParameters);
        console.log("Weather payload parsed successfully");

        console.log("Saving current weather data");
        await weatherService.SaveCurrent(device, payload);
        console.log("Weather data saved successfully");

        console.log("Submit-weather handler completed successfully");
        return responseFactory.createApiResponse(200, "Success");
    } catch (err) {
        console.error("Error in submit-weather handler:", err);
        return responseFactory.createApiResponse(500, `Internal server error: ${err.message}`);
    } finally {
        console.log("Completed submit-weather handler");
    }
};

export {handler};
