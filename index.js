const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/pages', express.static(path.join(__dirname, 'pages')));
const Utils = require(path.join(__dirname, './backend/Utils.js'));

/**************************************************************************************/
/*                  LANDING SITE                                                      */
/**************************************************************************************/
app.get('/', (req, res) => res.json({ success: true }));

/**************************************************************************************/
/*                  NYTIMES GAMES                                                     */
/**************************************************************************************/
const Nytimes = require(path.join(__dirname, './backend/nytimes/Nytimes.js'));
const NytimesDatabase = require(path.join(__dirname, './backend/nytimes/NytimesDatabase.js'));
const NyTimesResponses = new Map();

async function updateNytimesGames(){
    console.log('Updating game objects');

    const miniResponse = await Nytimes.getMiniCrossword();
    NyTimesResponses.set('miniCrossword', miniResponse);

    const dailyResponse = await Nytimes.getDaily();
    NyTimesResponses.set('daily', dailyResponse);

    const connectionsResponse = await Nytimes.getConnections();
    NyTimesResponses.set('connections', connectionsResponse);

    const letterBoxedResponse = await Nytimes.getLetterBoxed();
    NyTimesResponses.set('letterBoxed', letterBoxedResponse);
};

(async () => await updateNytimesGames())();

const NYTIMES_SECOND_INTERVAL = setInterval(() => {
    console.log('Checking second', Utils.getCurrentSecond());
    if(Utils.getCurrentSecond() === 30){
        clearInterval(NYTIMES_SECOND_INTERVAL);

        const NYTIMES_MINUTE_INTERVAL = setInterval(() => {
            console.log('Checking minute', Utils.getCurrentMinute());
            if(!Utils.getCurrentMinute()){
                clearInterval(NYTIMES_MINUTE_INTERVAL);

                const NYTIMES_HOURLY_INTERVAL = setInterval(() => {
                    console.log('Checking hour', Utils.getCurrentHour());
                    if(!Utils.getCurrentHour()){ updateNytimesGames(); } // Will update games at 12:00:30 am every day
                }, Utils.getTimeInMilliseconds({ hours: 1 }));
            }
        }, Utils.getTimeInMilliseconds({ minutes: 1 }));
    }
}, Utils.getTimeInMilliseconds({ seconds: 1 }));

// Serve the webpage
app.get('/nytimes', (req, res) => res.sendFile(path.join(__dirname, '/pages/nytimes/index.html')));

// Get the game's data
app.get('/nytimes/mini', (req, res) => res.json(NyTimesResponses.get('miniCrossword')));
app.get('/nytimes/daily', (req, res) => res.json(NyTimesResponses.get('daily')));
app.get('/nytimes/connections', (req, res) => res.json(NyTimesResponses.get('connections')));
app.get('/nytimes/letterBoxed', (req, res) => res.json(NyTimesResponses.get('letterBoxed')));

// ------------------------ MINI SPECFIC ------------------------
app.get('/nytimes/mini/times/today', async (req, res) => res.json(await NytimesDatabase.getTodaysEntries()));
app.get('/nytimes/mini/times/leaderboard', async (req, res) => res.json(await NytimesDatabase.getLeaderboard()));
app.post('/nytimes/mini/time/set', async (req, res) => {
    if(!req.body.name){                    return res.json({ success: false, error: 'Missing parameter \'name\'' }); }
    if(!req.body.time){                    return res.json({ success: false, error: 'Missing parameter \'time\'' }); }
    if(!req.body.dateString){              return res.json({ success: false, error: 'Missing parameter \'dateString\'' }); }
    if(req.body.checksUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'checksUsed\'' }); }
    if(req.body.revealUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'revealUsed\'' }); }

    res.json(await NytimesDatabase.addTimeEntry(req.body));
});

/**************************************************************************************/
/*                  STATIC SERVE ON PORT                                              */
/**************************************************************************************/
app.listen(3000, () => console.log('Running on port 3000'));