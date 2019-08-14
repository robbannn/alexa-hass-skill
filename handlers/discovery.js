const https = require('../https-requestor');

module.exports = function discover(event){
    let response = getResponseObject(event);
    let payload = { endpoints: [] };
    
    return https.get(process.env.DISCOVERY_PATH)
    .then(rawResult => JSON.parse(rawResult))
    .then(result => extractEndpoints(result))
    .then(endpoints => payload.endpoints = endpoints)
    .then(() => response.event.payload = payload)
    .then(() => response);
};

function getResponseObject(event){
    let response = { event: { header: event.directive.header } };
    response.event.header.name = "Discover.Response";
    
    return response;
}

function extractEndpoints(devices){
    let endpoints = [];
    
    devices.forEach(device => {
        device.entity_id.startsWith('switch.') ? endpoints.push(constructSwitchEndpoint(device)) : null;
        device.entity_id.startsWith('light.') ? endpoints.push(constructLightEndpoint(device)) : null;
    });
    
    return endpoints;
}

function constructSwitchEndpoint(device){
    return {
        "endpointId": device.entity_id.replace('.', '_'),
        "manufacturerName": "Nexa",
        "friendlyName": device.attributes.friendly_name,
        "description": "Power Outlet Switch",
        "displayCategories": ["SWITCH"],
        "cookie": {},
        "capabilities":[
            {
                "type": "AlexaInterface",
                "interface": "Alexa",
                "version": "3"
            },
            {
                "interface": "Alexa.PowerController",
                "version": "3",
                "type": "AlexaInterface",
                "properties": {
                    "supported": [{
                        "name": "powerState"
                    }],
                    "proactivelyReported": true,
                    "retrievable": true
                }
            },
            { 
                'type': 'AlexaInterface',
                'interface': 'Alexa.EndpointHealth',
                'version': '3',
                'properties': {
                    'supported': [{
                        'name': 'connectivity'
                    }],
                    'proactivelyReported': true,
                    'retrievable': true
                }
            }
        ]
    };
}

function constructLightEndpoint(device){
    return { 
        "endpointId": device.entity_id.replace('.', '_'),
        "manufacturerName": "Philips Hue",
        "friendlyName": device.attributes.friendly_name,
        "description": "Light Bulb",
        "displayCategories": ["LIGHT"],
        "cookie": {},
        "capabilities":[
            {
                "type": "AlexaInterface",
                "interface": "Alexa.PowerController",
                "version": "3",
                "properties": {
                    "supported": [ {
                        "name": "powerState"
                    }],
                    "proactivelyReported": true,
                    "retrievable": true
                }
            },
            {
                "type": "AlexaInterface",
                "interface": "Alexa",
                "version": "3"
            },
            { 
                'type': 'AlexaInterface',
                'interface': 'Alexa.EndpointHealth',
                'version': '3',
                'properties': {
                    'supported': [{
                        'name': 'connectivity'
                    }],
                    'proactivelyReported': true,
                    'retrievable': true
                }
            },
            {
                "type": "AlexaInterface",
                "interface": "Alexa.BrightnessController",
                "version": "3",
                "properties": {
                    "supported": [
                        {
                            "name": "brightness"
                        }
                    ],
                    "proactivelyReported": true,
                    "retrievable": true
                }
            }
        ]
    };
}