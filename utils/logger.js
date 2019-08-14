module.exports = function log(title, text){
    console.log(title, JSON.stringify(text, null, 2));
};