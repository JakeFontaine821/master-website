const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '/backend/nytimes/nytDatabase.db'));
const Utils = require(path.join(__dirname, '/backend/Utils.js'));

const addEntryStatement_mini = db.prepare(`INSERT INTO mini_times (name, time, dateString, checksUsed, revealUsed, topTen, placing) VALUES (@name, @time, @dateString, @checksUsed, @revealUsed, @topTen, @placing)`);
const time = Math.floor(Math.random() * 120)
for (let i = 1; i <= 5; i++) {
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
