const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const timestamp = require('./utils/timestamp');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const todosRoutes = require('./routes/todos');
const categoriesRoutes = require('./routes/categories');

app.use('/api/todos', todosRoutes);
app.use('/api/categories', categoriesRoutes);

app.get('/', (req, res) => {
    res.send('Backend läuft!');
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`[${timestamp()}] Start/ Reload. Server lausch auf Port ${PORT}`);
});