const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'pages')));
const Utils = require(path.join(__dirname, './backend/Utils.js'));

/**************************************************************************************/
/*                  LANDING SITE                                                      */
/**************************************************************************************/
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/pages/portfolio/index.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(__dirname, '/pages/portfolio/projects.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '/pages/portfolio/about.html')));
app.get('/resume', (req, res) => res.sendFile(path.join(__dirname, '/pages/portfolio/resume.html')));

/**************************************************************************************/
/*                  PIXEL PAINTER                                                      */
/**************************************************************************************/
app.get('/pixelpainter', (req, res) => res.sendFile(path.join(__dirname, '/pages/pixelPainter/index.html')));

/**************************************************************************************/
/*                          GAMES                                                     */
/**************************************************************************************/
const Games = require(path.join(__dirname, './backend/games/Games.js'));
const GamesDatabase_Mini = require(path.join(__dirname, './backend/games/GamesDatabase_Mini.js'));
const GamesDatabase_Daily = require(path.join(__dirname, './backend/games/GamesDatabase_Daily.js'));
const GamesDatabase_Maze = require(path.join(__dirname, './backend/games/GamesDatabase_Maze.js'));

// Serve the webpage
app.get('/games', (req, res) => res.sendFile(path.join(__dirname, '/games/index.html')));

// Get the game's data
app.get('/games/mini', (req, res) => res.json(Games.gameBoards.get('miniCrossword')));
app.get('/games/daily', (req, res) => res.json(Games.gameBoards.get('daily')));
app.get('/games/connections', (req, res) => res.json(Games.gameBoards.get('connections')));
app.get('/games/letterBoxed', (req, res) => res.json(Games.gameBoards.get('letterBoxed')));
app.get('/games/maze', (req, res) => res.json(Games.gameBoards.get('maze')));

// ------------------------ MINI SPECFIC ------------------------
app.get('/games/mini/times/get', async (req, res) => res.json(await GamesDatabase_Mini.getLeaderboardInfo()));
app.post('/games/mini/times/set', async (req, res) => {
    if(!req.body.name){                    return res.json({ success: false, error: 'Missing parameter \'name\'' }); }
    if(!req.body.time){                    return res.json({ success: false, error: 'Missing parameter \'time\'' }); }
    if(!req.body.dateString){              return res.json({ success: false, error: 'Missing parameter \'dateString\'' }); }
    if(req.body.checksUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'checksUsed\'' }); }
    if(req.body.revealUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'revealUsed\'' }); }

    res.json(await GamesDatabase_Mini.addTimeEntry(req.body));
});

// ------------------------ DAILY SPECFIC ------------------------
app.get('/games/daily/times/get', async (req, res) => res.json(await GamesDatabase_Daily.getLeaderboardInfo()));
app.post('/games/daily/times/set', async (req, res) => {
    if(!req.body.name){                    return res.json({ success: false, error: 'Missing parameter \'name\'' }); }
    if(!req.body.time){                    return res.json({ success: false, error: 'Missing parameter \'time\'' }); }
    if(!req.body.dateString){              return res.json({ success: false, error: 'Missing parameter \'dateString\'' }); }
    if(req.body.checksUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'checksUsed\'' }); }
    if(req.body.revealUsed === undefined){ return res.json({ success: false, error: 'Missing parameter \'revealUsed\'' }); }

    res.json(await GamesDatabase_Daily.addTimeEntry(req.body));
});

// ------------------------ MAZE SPECFIC ------------------------
app.get('/games/maze/times/get', async (req, res) => res.json(await GamesDatabase_Maze.getLeaderboardInfo()));
app.post('/games/maze/times/set', async (req, res) => {
    if(!req.body.name){                    return res.json({ success: false, error: 'Missing parameter \'name\'' }); }
    if(!req.body.time){                    return res.json({ success: false, error: 'Missing parameter \'time\'' }); }
    if(!req.body.dateString){              return res.json({ success: false, error: 'Missing parameter \'dateString\'' }); }

    res.json(await GamesDatabase_Maze.addTimeEntry(req.body));
});

/**************************************************************************************/
/*                    GAMES DEV PAGE                                                  */
/**************************************************************************************/
app.get('/games/dev', (req, res) => res.sendFile(path.join(__dirname, '/pages/games-dev/index.html')));
app.get('/games/dev/mini/times', async (req, res) => res.json(await GamesDatabase_Mini.getAllTimeEntries()));
app.post('/games/dev/mini/times/delete', async (req, res) => {
    if(!req.body.id){ return res.json({ success: false, error: 'Missing parameter \'id\'' }); }
    return res.json(await GamesDatabase_Mini.deleteTimeEntry(req.body));
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
            Games.updateGames();
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