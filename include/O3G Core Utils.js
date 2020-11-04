//~This file contains core utility functions not dependent on Tago API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//~ Form Validation Function 
var validation = function(validation_var, device) {
    return function _(message, type) {
      console.log('in validate function');
      if (!message || !type) throw 'Missing message or type';
      device.sendData({
        variable: validation_var,
        value: message,
        metadata: {
          type,
        },
      }).then(console.log);
    };
  }

//~ verification function
var VerifyInstallCoreJS = function(parm) {
	return "Got parm: " + parm;
	
};

//~ update an array of key, value pairs with another array , create the key if not found, update value if found
function CreateUpdateKeys(t, t1) {

	t.filter(e => !t1.find(e1 => e1.key == e.key)).forEach(e => t1.push(e));
	return t1;
}

//~ get the value of a tag from a key, value pairs array
function GetTagValue(t, k) {

	for (const e of t) {
		if (e.key == k) {
			return e.value;
		} 
	}
}

exports.VerifyInstallCoreJS = VerifyInstallCoreJS;
exports.validation = validation;
exports.CreateUpdateKeys = CreateUpdateKeys;
exports.GetTagValue = GetTagValue;