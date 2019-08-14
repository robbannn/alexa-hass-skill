const log = require('./utils/logger');
const reportState = require('./handlers/report-state');
const discover = require('./handlers/discovery');
const turnOnOff = require('./handlers/turn-on-off');
const setBrightness = require('./handlers/set-brightness');
const adjustBrightness = require('./handlers/adjust-brightness');

exports.handler = async (event) => {
    log("EVENT:", event);
    
    let type = event.directive.header.name;
    
    let response = await actOnType(type, event);
    log("RESPONSE:", response);
    
    return response;
};

async function actOnType(type, event){
    let payload;
    
    switch(type){
        case 'Discover': payload = await discover(event); break;
        case 'ReportState': payload = await reportState(event); break;
        case 'AcceptGrant': payload = await acceptGrant(event); break;
        case 'AdjustBrightness': payload = await adjustBrightness(event); break;
        case 'SetBrightness': payload = await setBrightness(event); break;
        case 'TurnOff': payload = await turnOnOff(event, 'OFF'); break;
        case 'TurnOn': payload = await turnOnOff(event, 'ON'); break;
        default: payload = event; break;
    }
    
    return payload;
}

function acceptGrant(event){
    let header = event.directive.header;
    header.name = 'AcceptGrant.Response';
    
    return { event: { header: header, payload: {} } };
}