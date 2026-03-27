require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const pool = require('./config/database'); // connexion BDD (mysql2/promise)

const app = express();
const PORT = 3000;

// ============ MIDDLEWARES ============
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ============ ROUTES ============

// Import des routes signalements
const signalementsRoutes = require('./routes/signalements');
app.use(signalementsRoutes);

// Import de la route export CSV
const exportRoute = require('./routes/export');
app.use('/', exportRoute);

// Route racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Test serveur
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Serveur Campus Éco-Responsable opérationnel !',
        timestamp: new Date().toISOString()
    });
});

// Test base de données
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS test');
        res.json({
            success: true,
            message: '✅ Connexion BDD réussie',
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Erreur connexion BDD',
            error: error.message
        });
    }
});

// Nouvelle route pour les statistiques
app.get('/statistiques', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT statut, COUNT(*) as total
            FROM signalements
            GROUP BY statut
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Erreur lors du calcul des statistiques" });
    }
});

// Modifier le statut d’un signalement
app.put('/signalement/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        // ✅ valeurs valides selon ta table ENUM
        const statutsValides = ['nouveau', 'en_cours', 'traite'];

        if (!statut || !statutsValides.includes(statut)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide.'
            });
        }

        const sql = `
            UPDATE signalements
            SET statut = ?, date_modification = NOW()
            WHERE id = ?
        `;

        const [result] = await pool.query(sql, [statut, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Signalement introuvable.'
            });
        }

        res.json({
            success: true,
            message: '✅ Statut mis à jour avec succès.'
        });

    } catch (error) {
        console.error('❌ Erreur mise à jour statut :', error.message);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la mise à jour du statut.',
            error: error.message
        });
    }
});

// Route 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

// ============ DÉMARRAGE ============
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║   🌱 CAMPUS ÉCO-RESPONSABLE & IA                ║
╠══════════════════════════════════════════════════╣
║  📍 Serveur démarré sur http://localhost:${PORT}
║  🔗 Test API: http://localhost:${PORT}/api/test
║  🗄️  Test BDD: http://localhost:${PORT}/api/test-db
║  📩 POST: http://localhost:${PORT}/signalement
║  📋 GET:  http://localhost:${PORT}/signalements
║  🔄 PUT:  http://localhost:${PORT}/signalement/:id
║  📤 EXPORT: http://localhost:${PORT}/export
╚══════════════════════════════════════════════════╝
    `);
});
