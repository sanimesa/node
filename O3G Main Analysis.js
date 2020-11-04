/*
 * Main Analysis for the O3G App 
 *
 */

const { Account, Analysis, Device, Utils } = require("@tago-io/sdk");
const { VerifyInstallCoreJS, validation } = require("./include/O3G Core Utils.js");
const { sendDeviceCommand, getDeviceData } = require("./include/O3G Tago Utils.js");

//~The main analysis entry point for the O3G application 
async function oMain(context, scope) {

    //context.log("Context here:", context);
    context.log("the scope:", JSON.stringify(scope));
    //context.log("scope 0: " + Object.getOwnPropertyNames(scope[0]));

    const env = Utils.envToJson(context.environment);

    if (!env.account_token) return context.log('Missing "account_token" environment variable');
    else if (env.account_token.length !== 36) return context.log('Invalid "account_token" in the environment variable');
    context.log("account token: " + env.account_token);
    const account = new Account({ token: env.account_token });

    if (scope.find(x => x.variable === 'scope' && x.value === 'Command')) {
        context.log("Variable scope found with value of Command");
    }

    const action = await actionHandler(context, scope);
    await action(context, scope);

    //5f8150ef8c66910027b1bb01
    //if (!env.command_analysis_id) return context.log('Missing "command_analysis_id" environment variable');
    //const analysis_id = env.command_analysis_id;
    //context.log("analysis id: " + analysis_id);
    const logger_id = env.logger;



}

async function actionHandler(context, scope) {
    if (scope.find(x => x.variable === 'scope' && x.value === 'Command')) {
        context.log("Variable scope found with value of Command");
        return deviceController;
    }
}

async function deviceController(context, scope) {
    context.log("Inside device controller");

    //~ these two lines need to be repeated? 
    const env = Utils.envToJson(context.environment);
    const account = new Account({ token: env.account_token });

    //const payload = scope.find(x => x.variable === 'payload') || { value: env.payload, origin: env.device_id };
    const payload = scope.find(x => x.variable === 'payload');
    context.log("payload: " + payload);
    const port = scope.find(x => x.variable === 'port') || { value: env.default_PORT };
    if (!payload || !payload.value || !payload.origin) return context.log('Missing "payload" in the data scope.');
    //else if (!port || !port.value) return context.log('Missing "port" in the data scope.');
    const duration = scope.find(x => x.variable === 'duration');
    
    const device_id = payload.origin; // All variables that trigger the analysis have the "origin" parameter, with the TagoIO Device ID.
    if (!device_id) return context.log('Device ID <origin> not found in the variables sent by the widget/dashboard.');

    //get a reference to validation function 
    context.log("before getting the validate function");
    //context.log("the token: " + token);
    //const device = new Device({token: "0b80f823-9c3a-4dc5-a36e-2ced0fada0d6"});
    //token = '36ba365a-e50e-4126-a2e0-220fda2e9611';
    //36ba365a-e50e-4126-a2e0-220fda2e9611
    //0b80f823-9c3a-4dc5-a36e-2ced0fada0d6 | 
    
    const token = await Utils.getTokenByName(account, device_id, ['Default']);
    const theDevice = new Device({"token": token});
    context.log("device created");
    
    const validate = validation('validation', theDevice);
    context.log("after getting the validate function: " + validate);

    //~ validate form input
    if (payload.value == '000000') { //must select a valid command
        validate('Please select a command.', 'danger');
        return context.log('Command not selected, exiting.');
    } 

    //~ check the device status
    const device_info = await account.devices.info(device_id);
    const tags = device_info.tags;
    if (payload.value == '090100' && tags.find(x => x.key == 'status' && x.value != 'stopped')) {
        validate('Device already activated.', 'danger');
        return context.log('Device already activated, exiting.');
    }

    //! check presence in the room 
    const theResult = await getDeviceData(theDevice, context, 'pir', 'last_item');
    //context.log("Result: " + theResult[0].value);
    //context.log("Result: " + theResult[0].time);
    //const theTime = theResult[0].time;
    //const theMinuteSince = Math.round((new Date() - new Date(theTime))/(1000*60));
    //const thePir = theResult[0].value;
    const thePir = 0;
    const theMinuteSince = 5;

    if (payload.value == '090100' && (thePir >= 1 || theMinuteSince > 10)) {
        validate('Room not clear, exiting.', 'danger');
        return context.log('Room not clear, exiting., exiting.');
    }

    //~ invoke the commmand analysis with the command
    context.log("scope origin: " + scope[0].origin);
    context.log("payload device: " + device_id);
    const scope1 = [{"target_device": device_id, "command": payload.value, "port": port.value, "duration": duration.value}];
    //const result = await account.analysis.run(analysis_id, scope1);
    //context.log("result: " + result);
    
    //await account.analysis.run(logger_id, ['Controller: Command sent to device ' + payload.value + " Duration: " + duration.value]);
    await sendDeviceCommand(account, context, device_id, payload, port);
    validate('Command sent successfully.', 'success');

}

//module.exports = new Analysis(oMain);

// To run analysis on your machine (external)
module.exports = new Analysis(oMain, { token: "e1b8a022-3f6f-411d-b681-87e96b747d14" });


