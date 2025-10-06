const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '/backend/nytimes/nytDatabase.db'));
const Utils = require(path.join(__dirname, '/backend/Utils.js'));

// db.prepare(`
//     CREATE TABLE IF NOT EXISTS mini_times (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         time INTEGER,
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

const addEntryStatement_mini = db.prepare(`INSERT INTO mini_times (name, time, dateString, checksUsed, revealUsed, topTen, placing) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed, @topTen, @placing)`);
const time = Math.floor(Math.random() * 120)
for (let i = 1; i <= 25; i++) {
    const entry = {
        name: 'AAA',
        time: time + i,
        dateString: Utils.getEasternDateString(),
        checksUsed: 2,
        revealUsed: 'true',
        topTen: 'true',
        placing: i
    }

    addEntryStatement_mini.run(entry);
}

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

// const updateEntryStatement_mini_data = db.prepare(`UPDATE mini_data SET averageTime=@averageTime WHERE dateString=@dateString`);
// const newObj = {
//     dateString: Utils.getEasternDateString(),
//     averageTime: Math.round(184.25)
// };
// updateEntryStatement_mini_data.run(newObj);
