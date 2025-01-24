const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API läuft!');
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server läuft! -> http://localhost:${PORT}`);
});