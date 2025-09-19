const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/pages', express.static(path.join(__dirname, 'pages')));

/**************************************************************************************/
/*                  LANDING SITE                                                      */
/**************************************************************************************/
app.get('/', (req, res) => res.json({ success: true }));

/**************************************************************************************/
/*                  NYTIMES GAMES                                                     */
/**************************************************************************************/
app.get('/nytimes', (req, res) => res.sendFile(path.join(__dirname, '/pages/nytimes/index.html')));

app.listen(3000, () => console.log('Running on port 3000'));