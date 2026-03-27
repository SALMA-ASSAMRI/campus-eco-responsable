const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { format } = require('@fast-csv/format');

router.get('/export', async (req, res) => {
    try {
        // ✅ Requête adaptée aux colonnes réelles de ta table
        const [rows] = await pool.query(`
            SELECT id, type, lieu, description, statut, date_creation, date_modification
            FROM signalements
            ORDER BY date_creation DESC
        `);

        // ✅ Encodage UTF-8 pour les accents
        res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');

        // ✅ Ajout du BOM pour que Excel reconnaisse UTF-8 automatiquement
        res.write('\uFEFF');

        // Création du flux CSV
        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        // ✅ Forcer les dates et descriptions en texte pour Excel
        rows.forEach(row => {
            if (row.date_creation instanceof Date) {
                row.date_creation = `"${row.date_creation.toISOString().slice(0, 19).replace('T', ' ')}"`;
            }
            if (row.date_modification instanceof Date) {
                row.date_modification = `"${row.date_modification.toISOString().slice(0, 19).replace('T', ' ')}"`;
            }
            if (row.description) {
                row.description = `"${row.description}"`; // ✅ Forcer description en texte
            }
            if (row.type) {
                row.type = `"${row.type}"`; // ✅ Forcer type en texte
            }
            csvStream.write(row);
        });

        csvStream.end();

    } catch (error) {
        console.error('❌ Erreur lors de l’export :', error.message);
        res.status(500).send('Erreur lors de l’export');
    }
});

module.exports = router;
