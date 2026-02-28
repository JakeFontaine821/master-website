const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './gamesDatabase.db'));
const Utils = require(path.join(__dirname, '../Utils.js'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS games_times (
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
const getTodaysEntriesStatement = db.prepare(`SELECT * FROM game_times WHERE gameTitle=@gameTitle AND dateString=@dateString`);
const getMONTHLeaderboardEntriesStatement = db.prepare(`SELECT * FROM game_times WHERE gameTitle=@gameTitle AND revealUsed='false' AND dateString LIKE @dateParam ORDER BY time ASC LIMIT 10`);
const getALLTIMELeaderboardEntriesStatement = db.prepare(`SELECT * FROM game_times WHERE gameTitle=@gameTitle AND revealUsed='false' ORDER BY time ASC LIMIT 10`);
const getAverageTimeStatement = db.prepare(`SELECT averageTime, dateString FROM game_data WHERE gameTitle=@gameTitle ORDER BY id DESC LIMIT 30`);
function getLeaderboardInfo(param){
    const returnObj = { success: true };

    const dateStringObj = { dateString: Utils.getEasternDateString() };
    try{ returnObj.today = getTodaysEntriesStatement.all(dateStringObj); }
    catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

    const date = new Date();
    const a = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-%`;
    try{ returnObj.month = getMONTHLeaderboardEntriesStatement.all({ dateParam: a }); }
    catch(err){ return { success: false, error: 'Error getting month entries from database' }; }

    try{ returnObj.allTime = getALLTIMELeaderboardEntriesStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting all time entries from database' }; }

    try{ returnObj.averageTimes = getAverageTimeStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting average time entry from database' }; }

    return returnObj;
};

const ALLTIME_LEADERBOARD_COUNT = 10;
const addEntryStatement_mini = db.prepare(`INSERT INTO game_times (name, time, dateString, checksUsed, revealUsed) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed)`);
const updateEntryStatement_mini_data = db.prepare(`UPDATE game_data SET averageTime=@averageTime WHERE dateString=@dateString`);
async function addTimeEntry(playData){
    // Add the entry to the data base
    try{ addEntryStatement_mini.run(playData); }
    catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }

    // Update the average times for the day
    try{
        let todaysEntries;
        const updateObj = { dateString: Utils.getEasternDateString() };

        try{ todaysEntries = getTodaysEntriesStatement.all(updateObj); }
        catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

        updateObj.averageTime = Math.round(todaysEntries.reduce((acc, cur) => acc += cur.time, 0) / todaysEntries.length);
        updateEntryStatement_mini_data.run(updateObj);
    }
    catch(err){
        console.error('ya mom', err);
        return { success: false, error: `Error updating average time in database: ${err}` };
    }

    return { success: true };
};

const getEntryStatement_mini_data = db.prepare(`SELECT * from game_data WHERE dateString=@dateString`);
const addEntryStatement_mini_data = db.prepare(`INSERT INTO game_data (gameBoard, dateString, averageTime) VALUES (@gameBoard, @dateString, @averageTime)`);
async function addNewGameBoard(gameBoard){
    const databaseObj = {
        gameBoard: JSON.stringify(gameBoard.data),
        dateString: gameBoard.data.publicationDate,
        averageTime: 0
    };

    try{ // only add a new one if its not already added, this supports project stopping and starting whenever
        const currentEntry = getEntryStatement_mini_data.all(databaseObj);
        if(!currentEntry.length){ addEntryStatement_mini_data.run(databaseObj); }
    }
    catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }
  
    return { success: true };
};

const getSingleEntryFromId = db.prepare(`SELECT * FROM game_times WHERE id=@id`);
const deleteTodaysEntryStatement = db.prepare(`DELETE FROM game_times WHERE id=@id`);
const getFastestEntries = db.prepare(`SELECT * FROM game_times ORDER BY time ASC LIMIT ${ALLTIME_LEADERBOARD_COUNT+5}`);
async function deleteTimeEntry(idObj){
    try{
        const entryToDelete = getSingleEntryFromId.get(idObj);
        if(!entryToDelete){ return { success: true }; }

        deleteTodaysEntryStatement.run(idObj);

        if(entryToDelete.topTen === 'true'){
            const allEntriesResponse = getFastestEntries.all();
            const entires = allEntriesResponse.sort((a, b) => a.time - b.time);

            for(const [i, entry] of entires.entries()){
                entry.topTen = i < ALLTIME_LEADERBOARD_COUNT ? 'true' : 'false';
                entry.placing = i < ALLTIME_LEADERBOARD_COUNT ? i+1 : 10000;

                updateEntryStatement_mini.run(entry);
            }
        }

        return { success: true };
    }
    catch(err){ return { success: false, error: 'Error getting entries from \'mini\' database' }; }
};

module.exports = {
    getAllTimeEntries,
    getLeaderboardInfo,
    addTimeEntry,
    addNewGameBoard,
    deleteTimeEntry,
};