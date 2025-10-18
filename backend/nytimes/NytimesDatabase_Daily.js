const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './nytDatabase.db'));
const Utils = require(path.join(__dirname, '../Utils.js'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS daily_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        time INTEGER,
        dateString TEXT,
        checksUsed INTEGER,
        revealUsed TEXT,
        topTen TEXT,
        placing INTEGER
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS daily_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameBoard TEXT,
        dateString TEXT,
        averageTime REAL
    )
`).run();

// DEV FUNCTION to return ALL time entries
const getEntriesStatement = db.prepare(`SELECT * FROM daily_times`);
function getAllTimeEntries(){
    const returnObj = { success: true };
    try{ returnObj.entries = getEntriesStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting entries from database' }; }
    return returnObj;
};

// Return all info for the leaderboard from the daily database
const getTodaysEntriesStatement = db.prepare(`SELECT * FROM daily_times WHERE dateString=@dateString`);
const getLeaderboardEntriesStatement = db.prepare(`SELECT * FROM daily_times WHERE topTen='true'`);
const getAverageTimeStatement = db.prepare(`SELECT averageTime, dateString FROM daily_data ORDER BY id DESC LIMIT 30`);
function getLeaderboardInfo(){
    const returnObj = { success: true };
    const dateStringObj = { dateString: Utils.getEasternDateString() };

    try{ returnObj.today = getTodaysEntriesStatement.all(dateStringObj); }
    catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

    try{ returnObj.allTime = getLeaderboardEntriesStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting all time entries from database' }; }

    try{ returnObj.averageTimes = getAverageTimeStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting average time entry from database' }; }

    return returnObj;
};

const ALLTIME_LEADERBOARD_COUNT = 10;
const addEntryStatement_daily = db.prepare(`INSERT INTO daily_times (name, time, dateString, checksUsed, revealUsed, topTen, placing) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed, @topTen, @placing)`);
const updateEntryStatement_daily = db.prepare(`UPDATE daily_times SET topTen=@topTen, placing=@placing WHERE id=@id`);
const updateEntryStatement_daily_data = db.prepare(`UPDATE daily_data SET averageTime=@averageTime WHERE dateString=@dateString`);
async function addTimeEntry(playData){
    if(playData.revealUsed === 'true'){
        // If reveal used, by default set topTen flag false and placing to crazy number
        try{ addEntryStatement_daily.run(Object.assign(playData, { topTen: 'false', placing: 10000 })); }
        catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }
    }
    else{
        // If reveal NOT used, by default set topTen true so to be caught by sql query, sorted and updated
        try{ addEntryStatement_daily.run(Object.assign(playData, { topTen: 'true', placing: ALLTIME_LEADERBOARD_COUNT+1 })); }
        catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }

        // See if the new entry should have any all time leaderboard related flags set
        try{
            const currentAllTimeBest = getLeaderboardEntriesStatement.all();

            // Sort the currentLeaderboard based on time
            currentAllTimeBest.sort((a, b) => a.time - b.time);

            // Entries now that are ordered, set the topTen and placing params based on index in the sorted array
            for(const [i, timeEntry] of currentAllTimeBest.entries()){
                timeEntry.topTen = i < ALLTIME_LEADERBOARD_COUNT ? 'true' : 'false';
                timeEntry.placing = i < ALLTIME_LEADERBOARD_COUNT ? i+1 : 10000000;

                updateEntryStatement_daily.run(timeEntry);
            }
        }
        catch(err){ return { success: false, error: `Error setting leaderboard params in database: ${err}` }; }

        // Calculate the average time from today's entries
        try{
            let todaysEntries;
            const updateObj = { dateString: Utils.getEasternDateString() };

            try{ todaysEntries = getTodaysEntriesStatement.all(updateObj); }
            catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

            updateObj.averageTime = Math.round(todaysEntries.reduce((acc, cur) => acc += cur.time, 0) / todaysEntries.length);
            updateEntryStatement_daily_data.run(updateObj);
        }
        catch(err){
            console.error('ya mom', err);
            return { success: false, error: `Error updating average time in database: ${err}` };
        }
    }

    return { success: true };
};

const getEntryStatement_daily_data = db.prepare(`SELECT * from daily_data WHERE dateString=@dateString`);
const addEntryStatement_daily_data = db.prepare(`INSERT INTO daily_data (gameBoard, dateString, averageTime) VALUES (@gameBoard, @dateString, @averageTime)`);
async function addNewGameBoard(gameBoard){
    const databaseObj = {
        gameBoard: JSON.stringify(gameBoard.data),
        dateString: gameBoard.data.publicationDate,
        averageTime: 0
    };

    try{ // only add a new one if its not already added, this supports project stopping and starting whenever
        const currentEntry = getEntryStatement_daily_data.all(databaseObj);
        if(!currentEntry.length){ addEntryStatement_daily_data.run(databaseObj); }
    }
    catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }
  
    return { success: true };
};

const getSingleEntryFromId = db.prepare(`SELECT * FROM daily_times WHERE id=@id`);
const deleteTodaysEntryStatement = db.prepare(`DELETE FROM daily_times WHERE id=@id`);
const getFastestEntries = db.prepare(`SELECT * FROM daily_times ORDER BY time ASC LIMIT ${ALLTIME_LEADERBOARD_COUNT+5}`);
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

                updateEntryStatement_daily.run(entry);
            }
        }

        return { success: true };
    }
    catch(err){ return { success: false, error: 'Error getting entries from \'daily\' database' }; }
};

module.exports = {
    getAllTimeEntries,
    getLeaderboardInfo,
    addTimeEntry,
    addNewGameBoard,
    deleteTimeEntry,
};