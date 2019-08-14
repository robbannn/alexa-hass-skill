module.exports = function brightnessPercent(brightness){
    let pct = Math.round(brightness / 255 * 100);
    
    pct = pct < 0 ? 0 :
        pct > 100 ? 100 : pct;
        
    return pct;
};