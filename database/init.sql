-- database/init.sql
-- Script pour créer la base de données et les tables

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS campus_eco 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- Utiliser cette base de données
USE campus_eco;

-- Créer la table des signalements
CREATE TABLE IF NOT EXISTS signalements (
    id INT AUTO_INCREMENT PRIMARY KEY,              -- Identifiant unique auto-généré
    type VARCHAR(50) NOT NULL,                       -- Type de problème (eau, énergie...)
    lieu VARCHAR(100) NOT NULL,                      -- Localisation précise
    description TEXT,                                -- Détails supplémentaires
    statut ENUM('nouveau', 'en_cours', 'traite')     -- Statut avec valeurs limitées
          DEFAULT 'nouveau',                         -- Par défaut : nouveau
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date auto
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
          ON UPDATE CURRENT_TIMESTAMP                -- Date de dernière modif auto
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Message de confirmation
SELECT 'Base de données campus_eco initialisée avec succès !' AS message;