const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './nytDatabase.db'));
const Utils = require(path.join(__dirname, '../Utils.js'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS mini_times (
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
    CREATE TABLE IF NOT EXISTS mini_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameBoard TEXT,
        dateString TEXT,
        averageTime REAL
    )
`).run();

// Return all info for the leaderboard from the mini database
const getTodaysEntriesStatement = db.prepare(`SELECT * FROM mini_times WHERE dateString=@dateString`);
const getLeaderboardEntriesStatement = db.prepare(`SELECT * FROM mini_times WHERE topTen='true'`);
const getAverageTimeStatement = db.prepare(`SELECT averageTime FROM mini_data ORDER BY id DESC LIMIT 30`);
function getLeaderboardInfo(){
    const returnObj = {};
    const dateStringObj = { dateString: Utils.getEasternDateString() };

    try{ returnObj.today = getTodaysEntriesStatement.all(dateStringObj); }
    catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

    try{ returnObj.allTime = getLeaderboardEntriesStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting all time entries from database' }; }

    try{ returnObj.averageTimes = getAverageTimeStatement.all().map(entry => entry.averageTime); }
    catch(err){ return { success: false, error: 'Error getting average time entry from database' }; }

    returnObj.success = true;
    return returnObj;
};

const ALLTIME_LEADERBOARD_COUNT = 10;
const addEntryStatement_mini = db.prepare(`INSERT INTO mini_times (name, time, dateString, checksUsed, revealUsed, topTen, placing) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed, @topTen, @placing)`);
const updateEntryStatement_mini = db.prepare(`UPDATE mini_times SET topTen=@topTen, placing=@placing WHERE id=@id`);
const updateEntryStatement_mini_data = db.prepare(`UPDATE mini_data SET averageTime=@averageTime WHERE dateString=@dateString`);
async function addTimeEntry(playData){
    if(playData.revealUsed === 'true'){
        // If reveal used, by default set topTen flag false and placing to crazy number
        try{ addEntryStatement_mini.run(Object.assign(playData, { topTen: 'false', placing: 10000 })); }
        catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }
    }
    else{
        // If reveal NOT used, by default set topTen true so to be caught by sql query, sorted and updated
        try{ addEntryStatement_mini.run(Object.assign(playData, { topTen: 'true', placing: ALLTIME_LEADERBOARD_COUNT+1 })); }
        catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }

        // See if the new entry should have any all time leaderboard related flags set
        try{
            const currentAllTimeBest = getLeaderboardEntriesStatement.all();

            // Sort the currentLeaderboard based on time
            currentAllTimeBest.sort((a, b) => a.time - b.time);

            // Entries now that are ordered, set the topTen and placing params based on index in the sorted array
            for(const [i, timeEntry] of currentAllTimeBest.entries()){
                timeEntry.topTen = i < ALLTIME_LEADERBOARD_COUNT ? 'true' : 'false';
                timeEntry.placing = i+1;

                updateEntryStatement_mini.run(timeEntry);
            }
        }
        catch(err){ return { success: false, error: `Error setting leaderboard params in database: ${err}` }; }

        // Calculate the average time from today's entries
        try{
            let todaysEntries;
            const updateObj = { dateString: Utils.getEasternDateString() };

            try{ todaysEntries = getTodaysEntriesStatement.all(updateObj); }
            catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

            updateObj.averageTime = todaysEntries.reduce((acc, cur) => acc += cur.time, 0) / todaysEntries.length;
            console.log(updateObj);
            updateEntryStatement_mini_data.run(updateObj);
        }
        catch(err){
            console.error('ya mom', err);
            return { success: false, error: `Error updating average time in database: ${err}` };
        }
    }

    return { success: true };
};

const getEntryStatement_mini_data = db.prepare(`SELECT * from mini_data`);
const addEntryStatement_mini_data = db.prepare(`INSERT INTO mini_data (gameBoard, dateString, averageTime) VALUES (@gameBoard, @dateString, @averageTime)`);
async function addNewGameBoard(gameBoard){
    const databaseObj = {
        gameBoard: JSON.stringify(gameBoard.data),
        dateString: gameBoard.data.publicationDate,
        averageTime: 0
    };

    try{ // only add a new one if its not already added, this supports project stopping and starting whenever
        const currentEntry = getEntryStatement_mini_data.all();
        if(!currentEntry.length){ addEntryStatement_mini_data.run(databaseObj); }
    }
    catch(err){ return { success: false, error: `Error inserting into database: ${err}` }; }
  
    return { success: true };
};

const deleteTodaysEntryStatement = db.prepare(`DELETE FROM mini_times WHERE id=@id`);
async function deleteTodaysEntry(entryObj){
    try{ return { success: true, data: deleteTodaysEntryStatement.run(entryObj) }; }
    catch(err){ return { success: false, error: 'Error getting entries from \'mini\' database' }; }
};

module.exports = {
    getLeaderboardInfo,
    addTimeEntry,
    addNewGameBoard,
    deleteTodaysEntry,
};