// backend/config/database.js
const mysql = require('mysql2/promise');

console.log('=== TEST CONFIG BDD ===');
console.log('host =', process.env.DB_HOST);
console.log('port =', process.env.DB_PORT);
console.log('user =', process.env.DB_USER);
console.log('password =', process.env.DB_PASSWORD);
console.log('database =', process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then((conn) => {
        console.log('✅ Connexion à la base de données réussie');
        conn.release();
    })
    .catch((err) => {
        console.error('❌ Erreur de connexion BDD :', err.message);
    });

module.exports = pool;
