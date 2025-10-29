const path = require('path');
const Database = require('better-sqlite3');
const newdb = new Database(path.join(__dirname, '/backend/games/gamesDatabase.db'));
const db = new Database(path.join(__dirname, '/backend/games/nytimesDatabase.db'));
const Utils = require(path.join(__dirname, '/backend/Utils.js'));

/*******************************************************************************************/
/*                                  USED TO CONVERT TABLE ENTRIES OR COLUMN DATA TYPE      */
/*******************************************************************************************/
// const allEntries = db.prepare('SELECT * from mini_times').all();
// console.log('Got all Entries');

// db.prepare('DROP TABLE mini_times').run();

// db.prepare(`
//     CREATE TABLE IF NOT EXISTS mini_times (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         time REAL,
//         dateString TEXT,
//         checksUsed INTEGER,
//         revealUsed TEXT,
//         topTen TEXT,
//         placing INTEGER
//     )
// `).run();

// const addEntryStatement_mini = db.prepare(`INSERT INTO mini_times (name, time, dateString, checksUsed, revealUsed, topTen, placing) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed, @topTen, @placing)`);
// for(const [i, entry] of allEntries.entries()){
//     if(entry.topTen === 'false'){ entry.placing = 10000000; }
//     addEntryStatement_mini.run(entry);
// }
// console.log('added entries to table copy');

/*******************************************************************************************/
/*                                  USED TO cREATE AND FILL TABLES WITH DUMMIE DATA        */
/*******************************************************************************************/
// db.prepare(`
//     CREATE TABLE IF NOT EXISTS mini_times (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         time REAL,
//         dateString TEXT,
//         checksUsed INTEGER,
//         revealUsed TEXT,
//         topTen TEXT,
//         placing INTEGER
//     )
// `).run();

// db.prepare(`
//     CREATE TABLE IF NOT EXISTS mini_data (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         gameBoard TEXT,
//         dateString TEXT,
//         averageTime REAL
//     )
// `).run();

// const addEntryStatement_mini = db.prepare(`INSERT INTO mini_times (name, time, dateString, checksUsed, revealUsed, topTen, placing) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed, @topTen, @placing)`);
// const time = Math.floor(Math.random() * 120);
// for (let i = 1; i <= 30; i++) {
//     const entry = {
//         name: ['','',''].map(a => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.round(Math.random() * 25)]).join(''),
//         time: time + i,
//         dateString: new Date(Date.now() - (Math.floor(Math.random() * 7) * 86400000)).toLocaleDateString("en-CA", { timeZone: "America/New_York" }),
//         checksUsed: Math.floor(Math.random() * 20),
//         revealUsed: 'false',
//         topTen: i <= 10 ? 'true' : 'false',
//         placing: i <= 10 ? i : 10000
//     };

//     addEntryStatement_mini.run(entry);
// }

// const addEntryStatement_mini_data = db.prepare(`INSERT INTO mini_data (gameBoard, dateString, averageTime) VALUES (@gameBoard, @dateString, @averageTime)`);
// const entries = ['',''].map((_, i) => {
//     return {
//         gameBoard: '{}',
//         dateString: new Date(Date.now() - (86400000 * i)).toLocaleDateString("en-CA", { timeZone: "America/New_York" }),
//         averageTime: Math.floor(Math.random() * 120)
//     }
// }).reverse();
// for(const entry of entries){
//     addEntryStatement_mini_data.run(entry);
// }

/*******************************************************************************************/
/*                                  COPY OVER ALL ENTRIES FROM ONE DATABASE TO ANOTHER     */
/*******************************************************************************************/
newdb.prepare(`
    CREATE TABLE IF NOT EXISTS mini_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        time REAL,
        dateString TEXT,
        checksUsed INTEGER,
        revealUsed TEXT,
        topTen TEXT,
        placing INTEGER
    )
`).run();

newdb.prepare(`
    CREATE TABLE IF NOT EXISTS mini_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameBoard TEXT,
        dateString TEXT,
        averageTime REAL
    )
`).run();

newdb.prepare(`
    CREATE TABLE IF NOT EXISTS daily_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        time REAL,
        dateString TEXT,
        checksUsed INTEGER,
        revealUsed TEXT,
        topTen TEXT,
        placing INTEGER
    )
`).run();

newdb.prepare(`
    CREATE TABLE IF NOT EXISTS daily_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameBoard TEXT,
        dateString TEXT,
        averageTime REAL
    )
`).run();

const tableNames = ['mini_times', 'mini_data'/*, 'daily_times', 'daily_data'*/];
for(const table of tableNames){
    // Get all the entries from the old database
    const allEntries = db.prepare(`SELECT * from ${table}`).all();
    console.log('got all entries from ', table);

    // Enter all entries into new database and table
    for(const entry of allEntries){
        delete entry['id'];
        const keys = Object.keys(entry);
        newdb.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(v => `@${v}`).join(', ')})`).run(entry);
    }

    console.log('All entries copied over :)')
}