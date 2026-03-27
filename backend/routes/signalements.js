const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // mysql2/promise

// ================== GET tous les signalements ==================
router.get('/signalements', async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT id, type, lieu, description, 
                   IF(anonyme = 1, 'Anonyme', nom) AS nom, 
                   anonyme, statut, date_creation, date_modification
            FROM signalements
            ORDER BY date_creation DESC
        `);
        res.json({ success: true, data: results });
    } catch (error) {
        console.error("❌ Erreur SQL:", error.message);
        res.status(500).json({ success: false });
    }
});

// ================== POST nouveau signalement ==================
router.post('/signalement', async (req, res) => {
    try {
        let { type, lieu, description, nom, anonyme } = req.body;

        // ✅ Forcer anonymisation si case cochée
        if (anonyme === "1" || anonyme === 1 || anonyme === true) {
            nom = null;
            anonyme = 1;
        } else {
            anonyme = 0;
        }

        // ✅ statut = 'nouveau'
        const sql = `
            INSERT INTO signalements (type, lieu, description, nom, anonyme, statut, date_creation)
            VALUES (?, ?, ?, ?, ?, 'nouveau', NOW())
        `;
        const [result] = await pool.query(sql, [type, lieu, description, nom, anonyme]);

        // 👉 Réponse simplifiée pour le frontend
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error("❌ Erreur ajout signalement:", error.message);
        res.status(500).json({ success: false });
    }
});

// ================== PUT mise à jour du statut ==================
router.put('/signalement/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const statutsValides = ['nouveau', 'en_cours', 'traite'];
        if (!statutsValides.includes(statut)) {
            return res.status(400).json({ success: false });
        }

        const sql = `
            UPDATE signalements 
            SET statut = ?, date_modification = NOW()
            WHERE id = ?
        `;
        const [result] = await pool.query(sql, [statut, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("❌ Erreur mise à jour statut:", error.message);
        res.status(500).json({ success: false });
    }
});

// ================== GET statistiques ==================
router.get('/statistiques', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT statut, COUNT(*) AS total
            FROM signalements
            GROUP BY statut
        `);

        const stats = { nouveau: 0, en_cours: 0, traite: 0 };
        rows.forEach(row => {
            stats[row.statut] = row.total;
        });

        res.json({ success: true, data: stats });
    } catch (error) {
        console.error("❌ Erreur statistiques:", error.message);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
