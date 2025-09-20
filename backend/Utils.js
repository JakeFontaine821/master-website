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
    return new Date(Date.now()).getUTCSeconds();
};

function getCurrentUTCMinute(){
    return new Date(Date.now()).getUTCMinutes();
};

function getCurrentUTCHour(){
    return new Date(Date.now()).getUTCHours();
};

function getEasternDateString() {
    return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

module.exports = {
    sendRequest,
    getTimeInMilliseconds,
    getCurrentSecond,
    getCurrentMinute,
    getCurrentHour,
    getEasternDateString,
};