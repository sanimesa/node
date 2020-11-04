//~This file contains Tago utility functions 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
const axios = require('axios');


//~ get data from a device 
async function getDeviceData(theDevice, context, theVariable, theQuery) {
    context.log("in get device data");
    const result = await theDevice.getData({
     query: theQuery? theQuery: "last_item",
     variable: theVariable
     });
 
   context.log("result: " + result);
   return result;
 }
 
//~ send a command to a device
var sendDeviceCommand = async function(account, context, device_id, payload, port) {
    context.log("inside the send device commmand function");

    // Find the token containing the authorization code used.
    const device_tokens = await account.devices.tokenList(device_id, { page: 1, fields: ['name', 'serie_number', 'last_authorization'], amount: 10 });
    const token = device_tokens.find(x => x.serie_number && x.last_authorization);
    if (!token) return context.log("Couldn't find a token with serial/authorization for this device");

    // Get the connector ID from the device
    const { network: network_id } = await account.devices.info(device_id);
    if (!network_id) return context.log('Device is not using a network.');

    // Get the network information with the NS URL for the Downlink
    const network = await account.integration.networks.info(network_id, ['id', 'middleware_endpoint', "name"]);
    if (!network.middleware_endpoint) return context.log("Couldn't find a network middleware for this device.");

    // Set the parameters for the device. Some NS like Everynet need this.
    const params = await account.devices.paramList(device_id);
    let downlink_param = params.find(x => x.key === 'downlink');
    downlink_param = { id: downlink_param ? downlink_param.id : null, key: 'downlink', value: String(payload), sent: false };
    await account.devices.paramSet(device_id, downlink_param);

    context.log('Trying to send the downlink');
    const data = {
    device: token.serie_number,
    authorization: token.last_authorization,
    payload: payload,
    port: port,
    };

    success = false;

    await axios.post(`https://${network.middleware_endpoint}/downlink`, data)
    .then((result) => {
        context.log(`Downlink accepted with status ${result.status}`);
        success = true;
    })
    .catch((error) => {
        context.log(`Downlink failed with status ${error.response.status}`);
        context.log(error.response.data || JSON.stringify(error));
        //await account.analysis.run(logger_id, "Command: Error sending downlink: " + error.response.data);
    });

    context.log("success: " + success);

    return success;
}

exports.sendDeviceCommand = sendDeviceCommand;
exports.getDeviceData = getDeviceData;