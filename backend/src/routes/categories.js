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


module.exports = router;
