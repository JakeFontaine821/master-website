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

// Serve the webpage
app.get('/nytimes', (req, res) => res.sendFile(path.join(__dirname, '/pages/nytimes/index.html')));

// Get the game's data
app.get('/nytimes/mini', (req, res) => res.json(Nytimes.gameBoards.get('miniCrossword')));
app.get('/nytimes/daily', (req, res) => res.json(Nytimes.gameBoards.get('daily')));
app.get('/nytimes/connections', (req, res) => res.json(Nytimes.gameBoards.get('connections')));
app.get('/nytimes/letterBoxed', (req, res) => res.json(Nytimes.gameBoards.get('letterBoxed')));

// ------------------------ MINI SPECFIC ------------------------
app.get('/nytimes/mini/times/get', async (req, res) => res.json(await NytimesDatabase.getLeaderboardInfo()));
app.post('/nytimes/mini/times/set', async (req, res) => {
    if(!req.body.name){                    return res.json({ success: false, error: 'Missing parameter \'name\'' }); }
    if(!req.body.time){                    return res.json({ success: false, error: 'Missing parameter \'time\'' }); }
    if(!req.body.dateString){              return res.json({ success: false, error: 'Missing parameter \'dateString\'' }); }
    if(req.body.checksUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'checksUsed\'' }); }
    if(req.body.revealUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'revealUsed\'' }); }

    res.json(await NytimesDatabase.addTimeEntry(req.body));
});

/**************************************************************************************/
/*                  GLOBAL TIME LOOP                                                  */
/**************************************************************************************/
const SECOND_INTERVAL = setInterval(() => {
    // console.log(`Checking SECOND ${`${Utils.getCurrentESTHour()}`.padStart(2, '0')}:${`${Utils.getCurrentUTCMinute()}`.padStart(2, '0')}:${`${Utils.getCurrentUTCSecond()}`.padStart(2, '0')}`);

    if(Utils.getCurrentUTCSecond() === 30){
        clearInterval(SECOND_INTERVAL);

        const MINUTE_INTERVAL = setInterval(() => {
            // console.log(`Checking MINUTE ${`${Utils.getCurrentESTHour()}`.padStart(2, '0')}:${`${Utils.getCurrentUTCMinute()}`.padStart(2, '0')}:${`${Utils.getCurrentUTCSecond()}`.padStart(2, '0')}`);

            if(!Utils.getCurrentUTCMinute()){
                clearInterval(MINUTE_INTERVAL);

                const HOURLY_INTERVAL = setInterval(() => GLOBAL_TIME_LOOP(), Utils.getTimeInMilliseconds({ hours: 1 }));
            }
        }, Utils.getTimeInMilliseconds({ minutes: 1 }));
    }
}, Utils.getTimeInMilliseconds({ seconds: 1 }));

// function to run 30 seconds into every hour, place new functions in here dependent on what hour to run
function GLOBAL_TIME_LOOP(){
    const currentEstTime = Utils.getCurrentESTHour();
    // console.log(`Checking HOUR ${`${currentEstTime}`.padStart(2, '0')}:${`${Utils.getCurrentUTCMinute()}`.padStart(2, '0')}:${`${Utils.getCurrentUTCSecond()}`.padStart(2, '0')}`);

    switch(currentEstTime){
        case 0: // 12:00:30 AM
            Nytimes.updateNytimesGames();
            break;
        case 1: // 1:00:30 AM
            break;
        case 2: // 2:00:30 AM
            break;
        case 3: // 3:00:30 AM
            break;
        case 4: // 4:00:30 AM
            break;
        case 5: // 5:00:30 AM
            break;
        case 6: // 6:00:30 AM
            break;
        case 7: // 7:00:30 AM
            break;
        case 8: // 8:00:30 AM
            break;
        case 9: // 9:00:30 AM
            break;
        case 10: // 10:00:30 AM
            break;
        case 11: // 11:00:30 AM
            break;
        case 12: // 12:00:30 PM
            break;
        case 13: // 1:00:30 PM
            break;
        case 14: // 2:00:30 PM
            break;
        case 15: // 3:00:30 PM
            break;
        case 16: // 4:00:30 PM
            break;
        case 17: // 5:00:30 PM
            break;
        case 18: // 6:00:30 PM
            break;
        case 19: // 7:00:30 PM
            break;
        case 20: // 8:00:30 PM
            break;
        case 21: // 9:00:30 PM
            break;
        case 22: // 10:00:30 PM
            break;
        case 23: // 11:00:30 PM
            break;
    }
};

/**************************************************************************************/
/*                  STATIC SERVE ON PORT                                              */
/**************************************************************************************/
app.listen(3000, () => console.log('Running on port 3000'));