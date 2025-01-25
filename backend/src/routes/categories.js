const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const buildHierarchy = (categories, parentId = null) => {
            return categories
                .filter((cat) => cat.parent_id === parentId)
                .map((cat) => ({
                    ...cat,
                    children: buildHierarchy(categories, cat.id),
                }));
        };

        const [categories] = await db.query('SELECT * FROM categories');
        const hierarchy = buildHierarchy(categories);

        res.json(hierarchy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/raw', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');

        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler beim Abrufen der Kategorien.' });
    }
});

module.exports = router;
