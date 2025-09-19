const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, './database.db'));
const Utils = require(path.join(__dirname, '../Utils.js'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS mini_leaderboard (
        name TEXT,
        time INTEGER,
        dateString TEXT,
        checksUsed INTEGER,
        revealUsed INTEGER
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS mini (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        time INTEGER,
        dateString TEXT,
        checksUsed INTEGER,
        revealUsed INTEGER
    )
`).run();


const getLeaderboardEntriesStatement = db.prepare(`SELECT * FROM mini_leaderboard`);
async function getLeaderboard(){
    try{ return { success: true, data: getLeaderboardEntriesStatement.all() }; }
    catch(err){ return { success: false, error: 'Error getting entries from \'mini_leaderboard\' database' }; }
};

const getTodaysEntriesStatement = db.prepare(`SELECT * FROM mini WHERE dateString=@dateString`);
async function getTodaysEntries(){
    try{ return { success: true, data: getTodaysEntriesStatement.all({ dateString: Utils.getEasternDateString() }) }; }
    catch(err){ return { success: false, error: 'Error getting entries from \'mini\' database' }; }
};

const addEntryStatement_mini = db.prepare(`INSERT INTO mini (name, time, dateString, checksUsed, revealUsed) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed)`);
const addEntryStatement_miniLeaderboard = db.prepare(`INSERT INTO mini_leaderboard (name, time, dateString, checksUsed, revealUsed) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed)`);
const deleteAllStatement = db.prepare('DELETE FROM mini_leaderboard');
async function addTimeEntry(playData){
    try{ addEntryStatement_mini.run(playData); }
    catch(err){ return { success: false, error: `Error inserting into \'mini\' database: ${err}` }; }

    if(playData.revealUsed){ return { success: true }; }
    try{
        const currentLeaderBoard = getLeaderboardEntriesStatement.all();

        // Clear all existing entries
        deleteAllStatement.run();

        // Sort the currentLeaderboard based on time
        currentLeaderBoard.push(playData);
        currentLeaderBoard.sort((a, b) => a.time - b.time);

        // Remove entries until the list is contained at 5 entries
        while(currentLeaderBoard.length > 5){ currentLeaderBoard.pop(); }

        // push all entries back to leaderboard
        for(const entry of currentLeaderBoard){ addEntryStatement_miniLeaderboard.run(entry); }
    }
    catch(err){ return { success: false, error: `Error inserting into \'mini_leaderboard\' database: ${err}` }; }

    return { success: true };
};

const deleteTodaysEntryStatement = db.prepare(`DELETE FROM mini WHERE id=@id`);
async function deleteTodaysEntry(entryObj){
    try{ return { success: true, data: deleteTodaysEntryStatement.run(entryObj) }; }
    catch(err){ return { success: false, error: 'Error getting entries from \'mini\' database' }; }
};

const deleteLeaderboardEntryStatement = db.prepare(`DELETE FROM mini_leaderboard WHERE name=@name AND time=@time AND dateString=@dateString AND checksUsed=@checksUsed AND revealUsed=@revealUsed`);
async function deleteLeaderboardEntry(entryObj){
    try{ return { success: true, data: deleteLeaderboardEntryStatement.run(entryObj) }; }
    catch(err){ return { success: false, error: 'Error getting entries from \'mini_leaderboard\' database' }; }
};

module.exports = {
    getLeaderboard,
    getTodaysEntries,
    addTimeEntry,
    deleteTodaysEntry,
    deleteLeaderboardEntry,
};