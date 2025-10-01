const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './nytDatabase.db'));
const Utils = require(path.join(__dirname, '../Utils.js'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS mini (
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

// Return all info for the leaderboard from the mini database
const getTodaysEntriesStatement = db.prepare(`SELECT * FROM mini WHERE dateString=@dateString`);
const getLeaderboardEntriesStatement = db.prepare(`SELECT * FROM mini WHERE topTen='true'`);
function getLeaderboardInfo(){
    const returnObj = {};

    try{ returnObj.today = getTodaysEntriesStatement.all({ dateString: Utils.getEasternDateString() }); }
    catch(err){ return { success: false, error: 'Error getting today\'s entries from database' }; }

    try{ returnObj.allTime = getLeaderboardEntriesStatement.all(); }
    catch(err){ return { success: false, error: 'Error getting all time entries from database' }; }

    returnObj.success = true;
    return returnObj;
};

const ALLTIME_LEADERBOARD_COUNT = 10;
const addEntryStatement_mini = db.prepare(`INSERT INTO mini (name, time, dateString, checksUsed, revealUsed, topTen, placing) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed, @topTen, @placing)`);
const updateEntryStatement_mini = db.prepare(`UPDATE mini SET topTen=@topTen, placing=@placing WHERE id=@id`);
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
    }

    return { success: true };
};

const deleteTodaysEntryStatement = db.prepare(`DELETE FROM mini WHERE id=@id`);
async function deleteTodaysEntry(entryObj){
    try{ return { success: true, data: deleteTodaysEntryStatement.run(entryObj) }; }
    catch(err){ return { success: false, error: 'Error getting entries from \'mini\' database' }; }
};

module.exports = {
    getLeaderboardInfo,
    addTimeEntry,
    deleteTodaysEntry,
};