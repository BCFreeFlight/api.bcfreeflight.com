// index.cjs
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {
    ResponseFactory, QueryParser,
    DynamoDBDeviceRepository, DynamoDBWeatherRepository,
    WeatherService, DeviceService
} = require('bcfreeflight');


// Table names
const deviceTable = "BCFF_Devices";
const weatherTable = "BCFF_Weather";

// Create dependencies
const dbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const responseFactory = new ResponseFactory();
const queryParser = new QueryParser();
const deviceRepository = new DynamoDBDeviceRepository(dbClient, deviceTable);
const weatherRepository = new DynamoDBWeatherRepository(dbClient, weatherTable);
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

    console.log(event.isBase64Encoded);
    console.log(event.body);
    const uploadKey = queryParser.getParam(event.queryStringParameters, "uploadKey");

    if (!uploadKey) {
        return responseFactory.createApiResponse(400, "Missing 'uploadKey' in query string.");
    }

    try {
        const device = await deviceService.getById(uploadKey);
        if (!device) {
            return responseFactory.createApiResponse(400, `Device with key '${uploadKey}' not found.`);
        }
        const payload = event.isBase64Encoded
            ? queryParser.parseBase64(event.body)
            : queryParser.parse(event.queryStringParameters);

        await weatherService.saveWeatherData(device, payload);
        return responseFactory.createApiResponse(200, "Success");
    } catch (err) {
        console.error(err);
        return responseFactory.createApiResponse(500, `Internal server error: ${err.message}`);
    }
};

export {handler};