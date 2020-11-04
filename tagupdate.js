var dict = {
  "customer": "ace",
  "type": "ozone",
  "status": "on"
};

var tags = [{"key":"customer","value":"ace"},{"key":"type","value":"ozone"},{"key":"time","value":"mytime"},{"key":"somevalue","value":"no"}];
var tags1 = [{"key":"customer","value":"ace"},{"key":"type","value":"ozone1"}, {"key":"newtest","value":"value"}];
var feed = {"app_id":"o3platform","dev_id":"o3sensor","hardware_serial":"A81758FFFE050BE4","port":5,"counter":16,"payload_raw":"0100BF023D08151214000F5D39180D7D","payload_fields":{"analog1":5394,"analog2":3453,"humidity":61,"pressure":1006.905,"temperature":19.1},"metadata":{"time":"2020-10-12T16:44:50.826881828Z","frequency":868.1,"modulation":"LORA","data_rate":"SF7BW125","coding_rate":"4/5","gateways":[{"gtw_id":"eui-0080000000015e57","timestamp":1654294035,"time":"","channel":0,"rssi":-56,"snr":11,"rf_chain":0}]}}

function TheFunct() {
	console.log(this.name);
}

function CreateUpdateKey(t, k, nv) {

	var n = [];
	var f = false;
	
	for (const e of t) {
		//console.log(e);

		if (e.key == k) {
			console.log("found the value");
			n.push({"key": k, "value":nv});
			f = true;
		} else {
			n.push({"key": e.key, "value": e.value});
		}
	}

	if (!f) {
		n.push({"key": k, "value": nv});
	}
	
	return n;
}

function CreateUpdateKeys2(t, t1) {

	var n = [];
	t1.forEach(e => n.push(e));
	t.filter(e => !t1.find(e1 => e1.key == e.key)).forEach(e => n.push(e));

	return n;
}

function CreateUpdateKeys(t, t1) {

	t.filter(e => !t1.find(e1 => e1.key == e.key)).forEach(e => t1.push(e));
	return t1;
	//return t.filter(e => !t1.find(e1 => e1.key == e.key));
}

function GetTagValue(t, k) {

	for (const e of t) {
		//console.log(e);
		if (e.key == k) {
			return e.value;
		} 
	}

	//return "";
}

function GetTagValue2(t, k) {
	return t.find(e => e.key == t);
}

function getScopeVariables(scope) {
	return scope[0].target_device;
}


//console.log(CreateUpdateKey(tags, "test", "newvalue"));
//console.log(CreateUpdateKey(tags1, "test", "newvalue"));
//console.log(GetTagValue(tags, "tasasype"));
//console.log(tags.find(x => x.key ==="test"));
//console.log(getScopeVariables([{"target_device":"12121213", "command": "0900000"}]));

console.log(CreateUpdateKeys(tags, [{"key": "status", "value": "activated"}, {"key": "activation_time", "value": new Date()}]));

console.log(feed.payload_fields.analog1);

console.log(JSON.stringify('{}'));
TheFunct();