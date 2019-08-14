const https = require('../https-requestor');

module.exports = function turnOnOff(event, value){
    event.directive.header.name = 'Response';
    event.directive.header.namespace = 'Alexa';
    
    let endpointId = event.directive.endpoint.endpointId;
    let path = getPath(endpointId, value);
    let data = getData(endpointId);
    
    
    return https.post(path, data)
    .then(() => getResponseObject(event, value));
};

function getResponseObject(event, value){
    return {
        event: event.directive,
        "context": {
            "properties": [ 
                {
                    "namespace": "Alexa.PowerController",
                    "name": "powerState",
                    "value": value,
                    "timeOfSample": new Date().toISOString(),
                    "uncertaintyInMilliseconds": 500
                }
            ]
        },
    };
}

function getPath(endpointId, value){
    let path;
    
    if(endpointId.startsWith('switch_')){
        path = process.env.SWITCH_ON_OFF + value.toLowerCase();
    }
    else if(endpointId.startsWith('light_')){
        path = value === 'OFF' ? process.env.SWITCH_ON_OFF : process.env.LIGHT_ON;
        path += value.toLowerCase();
    }
    else{
        path = '/';
    }
    
    return path;
}

function getData(endpointId){
    let req = { entity_id: endpointId.replace('_', '.') };
    
    if(endpointId.startsWith('light_')){
        req.transition = 1;
    }
    
    return JSON.stringify(req);
}