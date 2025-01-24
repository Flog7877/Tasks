const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [todos] = await db.query('SELECT * FROM todos');
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { title, details, w_score, d_score, hasDeadline, deadl_date, notify, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO todos (title, details, w_score, d_score, hasDeadline, deadl_date, notify, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, details, w_score, d_score, hasDeadline, deadl_date, notify, status]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
