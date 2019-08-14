const https = require('../https-requestor');
const log = require('../utils/logger');
const getBrightnessPercent = require('../utils/brightness-percent.js');

module.exports = function reportState(event){
    let header = event.directive.header;
    header.name = 'StateReport';
    
    let endpoint = event.directive.endpoint;
    
    return https.get(generatePath(event))
    .then(jsonRes => {
        let res = JSON.parse(jsonRes);
        return generateContext(res.state.toUpperCase(), res.attributes.brightness, event.directive.endpoint.endpointId);
    })
    .then(context => { return { event: { header: header, endpoint: endpoint, payload: {} }, context: context } });
};

function generatePath(event){
    return process.env.STATES_PATH + event.directive.endpoint.endpointId.replace('_', '.');
}

function generateContext(powerState, brightness, endpointId){
    let context = {
        properties: [
            {
              "namespace": "Alexa.PowerController",
              "name": "powerState",
              "value": powerState,
              "timeOfSample": new Date().toISOString(),
              "uncertaintyInMilliseconds": 500
            }
        ]
    };
    
    if(endpointId.startsWith('light_')){
        context.properties.push({
            "namespace": "Alexa.BrightnessController",
            "name": "brightness",
            "value": getBrightnessPercent(brightness) || 0,
            "timeOfSample": new Date().toISOString(),
            "uncertaintyInMilliseconds": 200
        });
    }
    
    return context;
}