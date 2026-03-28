const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // mysql2/promise

// ================== GET tous les signalements ==================
router.get('/signalements', async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT id, type, lieu, nom, description, anonyme, statut, date_creation, date_modification
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
        const { type, lieu, description, nom, anonyme } = req.body;

        // ✅ Forcer anonymisation si case cochée
        const nomFinal = (anonyme === "1" || anonyme === 1 || anonyme === true)
            ? "Anonyme"
            : nom;

        const anonymeFlag = (anonyme === "1" || anonyme === 1 || anonyme === true) ? 1 : 0;

        // ✅ statut = 'en_attente' par défaut
        await pool.query(
            "INSERT INTO signalements (type, lieu, nom, description, anonyme, statut, date_creation) VALUES (?, ?, ?, ?, ?, 'en_attente', NOW())",
            [type, lieu, nomFinal, description, anonymeFlag]
        );

        res.json({ 
            success: true, 
            message: "✔️ Signalement enregistré avec succès !" 
        });
    } catch (error) {
        console.error("❌ Erreur ajout signalement:", error.message);
        res.status(500).json({ success: false, message: "❌ Erreur lors de l’ajout du signalement." });
    }
});

// ================== PUT mise à jour du statut ==================
router.put('/signalement/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        // ✅ Liste des statuts valides
        const statutsValides = ['en_attente', 'en_cours', 'traite'];
        if (!statutsValides.includes(statut)) {
            return res.status(400).json({ success: false, message: "❌ Statut invalide." });
        }

        const sql = `
            UPDATE signalements 
            SET statut = ?, date_modification = NOW()
            WHERE id = ?
        `;
        const [result] = await pool.query(sql, [statut, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "❌ Signalement introuvable." });
        }

        res.json({ success: true, message: "✅ Statut mis à jour avec succès." });
    } catch (error) {
        console.error("❌ Erreur mise à jour statut:", error.message);
        res.status(500).json({ success: false, message: "❌ Erreur serveur lors de la mise à jour du statut." });
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

        // ✅ Initialiser avec les bons statuts
        const stats = { en_attente: 0, en_cours: 0, traite: 0 };
        rows.forEach(row => {
            stats[row.statut] = row.total;
        });

        res.json({ success: true, data: stats });
    } catch (error) {
        console.error("❌ Erreur statistiques:", error.message);
        res.status(500).json({ success: false, message: "❌ Erreur lors du calcul des statistiques." });
    }
});

module.exports = router;



