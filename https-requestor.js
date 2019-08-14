const https = require('https');

function post(path, stringifiedData){
    const options = getHttpsOptions(path, 'POST', stringifiedData);
    console.log("HTTP:", JSON.stringify(path, null, 2));
    console.log("HTTP:", JSON.stringify(stringifiedData, null, 2));
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            res.on('end', () => resolve());
            res.on('close', () => resolve());
            res.on('data', () => {});
        });
        
        req.on('error', err => {
            console.log("ERROR: ", err);
            reject(err);
        });
        
        req.write(stringifiedData);
        req.end();
    });
}

function get(path){
    const options = getHttpsOptions(path, 'GET');
    
    return new Promise((resolve, reject) => {
        https.get(options, resp => {
            let data = '';
            
            resp.on('data', chunk => data += chunk);
            
            resp.on('end', () => resolve(data));   
        })
        .on("error", (err) => reject(err));
    });
}

function getHttpsOptions(path, method, stringifiedData){
    let options = {
        host: process.env.HOST,
        method: method,
        headers: {
            "X-HA-Access": process.env.API_KEY,
            "Content-Type": "application/json"
        },
        path: path
    };
    
    if(stringifiedData){
        options.headers['Content-Length'] = Buffer.byteLength(stringifiedData);
        options.body = stringifiedData;
    }
    
    return options;
}

module.exports = {
    get: get,
    post: post
};