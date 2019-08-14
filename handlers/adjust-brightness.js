const https = require('../https-requestor');
const getBrightnessPercent = require('../utils/brightness-percent');
const setBrightness = require('./set-brightness');

module.exports = function turnOnOff(event){
    event.directive.header.name = 'SetBrightness';
    
    let endpointId = event.directive.endpoint.endpointId;
    let path = process.env.STATES_PATH + endpointId.replace('_', '.');
    
    return https.get(path)
    .then(res => getSetBrightnessObject(event, getBrightnessPercent(JSON.parse(res).attributes.brightness)))
    .then(brightnessObj => setBrightness(brightnessObj));
};

function getSetBrightnessObject(event, brightness){
    let obj = { directive: event.directive };
    
    obj.directive.payload = { brightness: brightness + event.directive.payload.brightnessDelta };
    
    return obj;
}