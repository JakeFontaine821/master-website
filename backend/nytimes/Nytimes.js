const path = require('path');
const Utils = require(path.join(__dirname, '../Utils.js'));
const NytimesDatabase_Mini = require(path.join(__dirname, './NytimesDatabase_Mini.js'));
const NytimesDatabase_Daily = require(path.join(__dirname, './NytimesDatabase_Daily.js'));

async function getMiniCrossword(){
    const url = 'https://www.nytimes.com/svc/crosswords/v6/puzzle/mini.json';
    const params = {
        'headers': {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded',
            'priority': 'u=1, i',
            'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-games-auth-bypass': 'true',
            'cookie': 'nyt-a=mrKsejlFHMcu4nsIlw3PBF; nyt-purr=cfshcfhshckfhdfshgas2taaa; nyt-m=6E2F76A07A7F5D2159C45692CDA1ABE3&t=i.0&v=i.0&vr=l.4.0.0.0.0&pr=l.4.0.0.0.0&ica=i.0&ird=i.0&iir=i.0&rc=i.0&ifv=i.0&imv=i.0&cav=i.1&imu=i.1&igu=i.1&ier=i.0&igd=i.1&s=s.crosswords&uuid=s.d89028b4-6a04-42a1-af16-bff58d5f436b&igf=i.0&g=i.1&e=i.1756735200&er=i.1756610223&prt=i.0&iue=i.0&iru=i.1&ira=i.0&fv=i.0&vp=i.0&ft=i.0&iub=i.0&n=i.2&iga=i.0; nyt-gdpr=0; nyt-geo=US; nyt-jkidd=uid=0&lastRequest=1756943493735&activeDays=%5B0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C1%2C0%2C1%2C1%2C0%2C1%2C0%2C1%2C1%5D&adv=6&a7dv=5&a14dv=6&a21dv=6&lastKnownType=anon&newsStartDate=&entitlements=; _dd_s=rum=0&expire=1756944397372',
            'Referer': 'https://www.nytimes.com/crosswords/game/mini'
        },
        'body': null,
        'method': 'GET'
    };

   return await Utils.sendRequest(url, params);
};

async function getDaily(){
    const url = 'https://www.nytimes.com/svc/crosswords/v6/puzzle/daily.json';
    const params = {
        'headers': {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-games-auth-bypass': 'true',
            'cookie': 'nyt-a=mrKsejlFHMcu4nsIlw3PBF; nyt-purr=cfshcfhshckfhdfshgas2taaa; _helpjuice_session_v2=24wVanuoHlBFA51quKtCXyKVzniSQufVPXaArF2jz8WfoCZ%2FMphvlj2PC7uETdsRDF%2FHdpWXx%2Fa3FEyuReifK8%2BUp8Z6eWVSI0%2BzfrLjl2zxhjerDLBueEEsY%2BCIE5bjiyqHPOhYz7PaTITzoRc1qRSvuSUuoku3vLViS%2BqaflWZPE3zgllfNPJzpC79JPuz9A7Yru18jVfxkNeX3KkERtUioUONkUPwnjX0FlYzZfCPURdMwyjcfoje2pskcghpeVh6GAIedwHePZpChK55yw7osjwCHbV6f1e6mKwxrSvPms1N9JAVhabYd30I9crR1bun--YiJ5K3p4a2kwqveg--LuhBVyG4XL1MnyZzBqhWeA%3D%3D; nyt-gdpr=0; nyt-geo=US; nyt-m=CEFE1284FAD1C7EDF1488BD52DD22D07&n=i.2&pr=l.4.0.0.0.0&ft=i.0&iir=i.0&e=i.1756735200&prt=i.0&uuid=s.d89028b4-6a04-42a1-af16-bff58d5f436b&g=i.1&vp=i.0&ier=i.0&iub=i.0&igd=i.1&t=i.0&v=i.0&rc=i.0&iga=i.0&imv=i.0&ird=i.0&ira=i.0&ifv=i.0&s=s.crosswords&iue=i.0&iru=i.1&fv=i.0&cav=i.1&imu=i.1&ica=i.0&er=i.1756608323&vr=l.4.0.0.0.0&igu=i.1&igf=i.0; nyt-jkidd=uid=0&lastRequest=1756608323447&activeDays=%5B0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C1%2C0%2C1%2C1%2C0%2C1%5D&adv=4&a7dv=4&a14dv=4&a21dv=4&lastKnownType=anon&newsStartDate=&entitlements=; _dd_s=rum=0&expire=1756609689306',
            'Referer': 'https://www.nytimes.com/crosswords/game/daily'
        },
        'body': null,
        'method': 'GET'
    };

   return await Utils.sendRequest(url, params);
};

async function getConnections(){
    const url = 'https://www.nytimes.com/svc/connections/v2/2025-08-28.json';
    const params = {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'nyt-a=mrKsejlFHMcu4nsIlw3PBF; nyt-purr=cfshcfhshckfhdfshgas2taaa; nyt-gdpr=0; nyt-geo=US; _helpjuice_session_v2=NkzRYMGldHYzriKoIAy6HodbUw2LF0NNmfR4Rl4fc1uad10n7UHOaGaIySoTsEjIdeCicYnfZ2BjKhhf%2BoqUh1yOUxu2u72KW1sP%2BT90A%2BtijdLCMM8A2keQXrpUmo4xXb6hIOAkDezYCWPZENFbCtUC7AQHU0f9yhlEG0z4mXBIaaoAO3wSfRWSwBh9nNB%2BQi4f7pML7waf37jeopmp%2Fzjz3%2BiU8mPGkqNjxXsTpZk64G7x1SCbp%2Bn5BhcebJNXrRpepoq2QhnzSVr5PPmWMWd6HD8Ob2EOd3f6GhI2jQP5gXngYDVZ4YBq1tvIqj6FHlxS--ZXhy%2BuSOsI9uEIpQ--Owu76mM3trN7qJQeaghb%2Fg%3D%3D; nyt-jkidd=uid=0&lastRequest=1756425680214&activeDays=%5B0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C1%2C0%2C1%2C1%5D&adv=3&a7dv=3&a14dv=3&a21dv=3&lastKnownType=anon&newsStartDate=&entitlements=; _dd_s=rum=0&expire=1756426605249',
        'priority': 'u=1, i',
        'referer': 'https://www.nytimes.com/games/connections',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
    };

   return await Utils.sendRequest(url, params);
};

async function getLetterBoxed(){
    const res = await fetch('https://www.nytimes.com/puzzles/letter-boxed');
    const text = await res.text();//<\/div><div id="portal-editorial-content">
    const match = text.match(/<script\stype=["|']text\/javascript["|']>\s*window\.gameData\s*=\s*(\{[\s\S]*?\});?<\/script>/s);

    if (match) {
        const gameData = JSON.parse(match[1]);
        return Object.assign(gameData, { success: true });
    }

    return { success: false };
};

const NyTimesResponses = new Map();

async function updateNytimesGames(){
    console.log('Updating game objects');

    const miniResponse = await getMiniCrossword();
    NyTimesResponses.set('miniCrossword', miniResponse);
    NytimesDatabase_Mini.addNewGameBoard(miniResponse);

    const dailyResponse = await getDaily();
    NyTimesResponses.set('daily', dailyResponse);
    NytimesDatabase_Daily.addNewGameBoard(dailyResponse);

    const connectionsResponse = await getConnections();
    NyTimesResponses.set('connections', connectionsResponse);

    const letterBoxedResponse = await getLetterBoxed();
    NyTimesResponses.set('letterBoxed', letterBoxedResponse);
};
updateNytimesGames();

module.exports = {
    gameBoards: NyTimesResponses,
    getMiniCrossword,
    getDaily,
    getConnections,
    getLetterBoxed,
    updateNytimesGames,
};