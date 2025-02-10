const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- Hilfsfunktionen ---

const formatDatetime = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const formatDate = (isoString) => {
    if (!isoString) return null;
    return isoString.slice(0, 10);
};

router.get('/', async (req, res) => {
    try {
        const [todos] = await db.query('SELECT * FROM todos');
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { title, details, steps, importanceScore, urgencyScore, categories, status, dateMode, todoDate, recurrence, endDate, notifications } = req.body;
    try {
        const category_id_list = [];

        if (categories.length > 0) {
            for (let catObj of categories) {
                category_id_list.push(catObj.id);
            }
        }

        const categoriesJSON = JSON.stringify(category_id_list);
        const stepsJSON = JSON.stringify(steps);

        const datetimeString = formatDatetime(todoDate);
        const endDateString = formatDate(endDate);
        const hasNotifications = notifications.length > 0 ? true : false;
        const query = 'INSERT INTO todos (title, details, steps, w_score, d_score, category_ids, status, dateMode, todoDatetime, recurrence, endDate, notification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const [result] = await db.query(
            query,
            [title, details, stepsJSON, importanceScore, urgencyScore, categoriesJSON, status, dateMode, datetimeString, recurrence, endDateString, hasNotifications]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Fehler:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [todo] = await db.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
        if (todo.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(todo[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;