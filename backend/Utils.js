async function sendRequest(url, params){
    let response;
    try{ response = await fetch(url, params); }
    catch(err){ return {success: false, error: err}; }

    let data;
    try{ data = await response.json(); }
    catch(err){ return {success: false, error: err}; }

    return {success: true, data: data};
};

function getTimeInMilliseconds(params){
    const convertedTime = [
        params.days         ? params.days * 86400000     : 0,
        params.hours        ? params.hours * 3600000     : 0,
        params.minutes      ? params.minutes * 60000     : 0,
        params.seconds      ? params.seconds * 1000      : 0,
        params.milliseconds ? params.milliseconds        : 0,
    ];

    return Math.max(convertedTime.reduce((acc, cur) => acc += cur, 0), 1000); // no less than a second
};

function getCurrentUTCSecond(){
    return new Date().getUTCSeconds();
};

function getCurrentUTCMinute(){
    return new Date().getUTCMinutes();
};

function getCurrentUTCHour(){
    return new Date().getUTCHours();
};

function getCurrentESTHour(){
    return (new Date().getUTCHours() + 19) % 24;
};

function getEasternDateString() {
    return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
};

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
};

module.exports = {
    sendRequest,
    getTimeInMilliseconds,
    getCurrentUTCSecond,
    getCurrentUTCMinute,
    getCurrentUTCHour,
    getCurrentESTHour,
    getEasternDateString,
    uuidv4,
};