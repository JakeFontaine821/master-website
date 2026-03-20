const path = require('path');
const Database = require('better-sqlite3');
const { constrainedMemory } = require('process');
const db = new Database(path.join(__dirname, './gamesDatabase.db'));
const Utils = require(path.join(__dirname, '../Utils.js'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS game_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameTitle TEXT,
        name TEXT,
        time REAL,
        dateString TEXT,
        checksUsed INTEGER,
        revealUsed TEXT
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS game_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameTitle TEXT,
        gameBoard TEXT,
        dateString TEXT,
        averageTime REAL
    )
`).run();

// DEV FUNCTION to return ALL time entries
const getEntriesStatement = db.prepare(`SELECT * FROM game_times ORDER BY gameTitle ASC`);
function getAllTimeEntries(){
    const returnObj = { success: true };
    try{ returnObj.entries = getEntriesStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting entries from database' }; }
    return returnObj;
};

// Return all info for the leaderboard from the mini database
const getTodaysEntriesStatement = db.prepare(`SELECT * FROM game_times WHERE gameTitle=@gameTitle AND dateString=@dateString ORDER BY time ASC`);
const getMONTHLeaderboardEntriesStatement = db.prepare(`SELECT * FROM game_times WHERE gameTitle=@gameTitle AND revealUsed='false' AND dateString LIKE @dateParam ORDER BY time ASC LIMIT 10`);
const getALLTIMELeaderboardEntriesStatement = db.prepare(`SELECT * FROM game_times WHERE gameTitle=@gameTitle AND revealUsed='false' ORDER BY time ASC LIMIT 10`);
const getAverageTimeStatement = db.prepare(`SELECT averageTime, dateString FROM game_data WHERE gameTitle=@gameTitle ORDER BY id DESC LIMIT 30`);
function getLeaderboardInfo(params){
    const returnObj = { success: true };
    
    const date = new Date();
    Object.assign(params, {
        dateString: Utils.getEasternDateString(),
        dateParam: `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-%`
    });

    try{ returnObj.today = getTodaysEntriesStatement.all(params); }
    catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }


    try{ returnObj.monthly = getMONTHLeaderboardEntriesStatement.all(params); }
    catch(err){ return { success: false, error: 'Error getting month entries from database' }; }

    try{ returnObj.allTime = getALLTIMELeaderboardEntriesStatement.all(params); }
    catch(err){ return { success: false, error: 'Error getting all time entries from database' }; }

    try{ returnObj.averageTimes = getAverageTimeStatement.all(params); }
    catch(err){ return { success: false, error: 'Error getting average time entry from database' }; }

    return returnObj;
};

const addEntryStatement_gameTimes = db.prepare(`INSERT INTO game_times (name, time, dateString, checksUsed, revealUsed) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed)`);
const updateEntryStatement_gameData = db.prepare(`UPDATE game_data SET averageTime=@averageTime WHERE dateString=@dateString`);
async function addTimeEntry(playData){
    // Add the entry to the data base
    try{ addEntryStatement_gameTimes.run(playData); }
    catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }

    // Update the average times for the day
    try{
        let todaysEntries;
        const updateObj = { dateString: Utils.getEasternDateString() };

        try{ todaysEntries = getTodaysEntriesStatement.all(updateObj); }
        catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

        updateObj.averageTime = Math.round(todaysEntries.reduce((acc, cur) => acc += cur.time, 0) / todaysEntries.length);
        updateEntryStatement_gameData.run(updateObj);
    }
    catch(err){
        console.error('ya mom', err);
        return { success: false, error: `Error updating average time in database: ${err}` };
    }

    return { success: true };
};

const getEntryStatement_gameData = db.prepare(`SELECT * from game_data WHERE dateString=@dateString`);
const addEntryStatement_gameData = db.prepare(`INSERT INTO game_data (gameBoard, dateString, averageTime) VALUES (@gameBoard, @dateString, @averageTime)`);
async function addNewGameBoard(gameTitle, gameBoard){
    const databaseObj = {
        gameTitle: gameTitle,
        gameBoard: JSON.stringify(gameBoard.data),
        dateString: gameBoard.data.publicationDate,
        averageTime: 0
    };

    try{ // only add a new one if its not already added, this supports project stopping and starting whenever
        const todaysGamesData = getEntryStatement_gameData.all(databaseObj);
        if(todaysGamesData.every(v => v.gameTitle !== gameTitle)){ addEntryStatement_gameData.run(databaseObj); }
    }
    catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }
  
    return { success: true };
};

const deleteTodaysEntryStatement = db.prepare(`DELETE FROM game_times WHERE id=@id`);
async function deleteTimeEntry(idObj){
    try{
        deleteTodaysEntryStatement.run(idObj);
        return { success: true };
    }
    catch(err){ return { success: false, error: 'Error getting entries from game_times database' }; }
};

module.exports = {
    getAllTimeEntries,
    getLeaderboardInfo,
    addTimeEntry,
    addNewGameBoard,
    deleteTimeEntry,
};