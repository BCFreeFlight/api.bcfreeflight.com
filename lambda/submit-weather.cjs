// index.cjs
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {ResponseFactory, QueryParser, DynamoDBDeviceRepository, DynamoDBWeatherRepository, WeatherService, DeviceService} = require('bcfreefree');

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

module.exports = { handler };