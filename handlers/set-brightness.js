const https = require('../https-requestor');

module.exports = function setBrightness(event){
    event.directive.header.name = 'Response';
    event.directive.header.namespace = 'Alexa';
    
    let endpointId = event.directive.endpoint.endpointId;
    let brightness = event.directive.payload.brightness;
    let path = process.env.LIGHT_ON + 'on';
    let data = getData(endpointId, brightness);
    
    
    return https.post(path, data)
    .then(() => getResponseObject(event, brightness));
};

function getResponseObject(event, brightness){
    return {
        event: event.directive,
        "context": {
            "properties": [ 
                {
                    "namespace": "Alexa.BrightnessController",
                    "name": "brightness",
                    "value": brightness,
                    "timeOfSample": new Date().toISOString(),
                    "uncertaintyInMilliseconds": 500
                }
            ]
        },
    };
}

function getData(endpointId, value){
    let req = { 
        entity_id: endpointId.replace('_', '.'),
        transition: 1,
        brightness_pct: value
    };
    
    return JSON.stringify(req);
}