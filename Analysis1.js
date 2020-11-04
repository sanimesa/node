/*
 ** View and Edit Device Tags
 */

const { Analysis, Account, Devices, Device, DeviceInfo, TagsObj, Services, Utils } = require("@tago-io/sdk");
//const moment = require("moment-timezone");

async function myAnalysis(context) {
  // Transform all Environment Variable to JSON.
  const env = Utils.envToJson(context.environment);

  if (!env.account_token) {
    return context.log("You must setup an account_token in the Environment Variables.");
  } 

  const account = new Account({ token: env.account_token });

  // Set up the specific tags here
  const filter = { tags: [{ key: "type", value: "ozone" }] };

  const devices = await account.devices.list({
    page: 1,
    amount: 1000,
    fields: ["id", "name", "last_input"],
    filter,
  });

  if (!devices.length) {
    return context.log(`No device found with given tags. `);
  }

  context.log("Checking devices: ", devices.map((x) => x.name).join(", "));
  context.log("Device id: " + devices[0].id);
  
  const tag = new TagsObj("test", "newvalue");
  context.log("After creating the objects");

  const devInfo = new DeviceInfo(tag);
  context.log("After creating the objects");

  await account.devices.edit(devices[0].id, devInfo);
  
}

//module.exports = new Analysis(myAnalysis);

//To run analysis on your machine (external)
module.exports = new Analysis(myAnalysis, { token: "f5da2909-4542-4293-988e-8ce23df34d46" });
