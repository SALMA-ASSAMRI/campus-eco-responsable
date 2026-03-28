# 🌱 Campus Éco-Responsable

## 📌 Description
Application web permettant aux étudiants et au personnel de **signaler des problèmes écologiques** sur le campus (déchets, fuites d’eau, pollution, gaspillage d’énergie, etc.).  
Objectif : sensibiliser et améliorer la gestion écologique du campus grâce à une interface simple et intuitive.

---

## 🚀 Fonctionnalités
- Formulaire de signalement :
  - Type de problème
  - Lieu
  - Nom (ou anonymat)
  - Description
- Case à cocher pour envoyer anonymement.
- Liste des signalements avec statut (`en_attente`, `en_cours`, `traite`).
- Statistiques globales.
- Export des données en **CSV**.
- Interface ergonomique et harmonisée (HTML/CSS/JS).
- Backend en **Node.js + Express** avec base de données **MySQL**.

---

## 🛠️ Technologies
- **Frontend** : HTML, CSS, JavaScript  
- **Backend** : Node.js, Express  
- **Base de données** : MySQL  
- **Versioning** : Git & GitHub  

---

## ⚙️ Installation
1. **Cloner le projet** :
   ```bash
   git clone https://github.com/SALMA-ASSAMRI/campus-eco-responsable.git
   cd campus-eco-responsable
2_ Installer les dépendances backend :
cd backend
npm install
3 -Configurer la base MySQL :

    Créer une base campus_db

    Importer le script SQL (db.sql)

    Vérifier que la table signalements contient :
    id, type, lieu, nom, description, anonyme, statut, date_creation, date_modification
   4- Lancer le serveur backend :
    node server.js
  5 -Ouvrir le frontend :
  Ouvrir frontend/index.html dans le navigateur

📊 Exemple d’utilisation

    Signaler un déchet dans la salle C1 → apparaît dans la liste avec statut en_attente.

    Cocher “Envoyer anonymement” → le champ nom est remplacé par “Anonyme”.

    Exporter les signalements en CSV pour analyse.

👩‍💻 Auteur

Projet développé par Salma Assamri  
Rôle : Product Owner et Développeuse Full-Stack.
Remplir le formulaire et tester
📜 Licence

Projet académique – utilisation libre pour l’apprentissage et la sensibilisation écologique.
Code

### 🎯 Résultat attendu
- Tu colles ce texte dans ton fichier **README.md** (à la racine du projet).  
- Sur GitHub, il sera affiché automatiquement en page d’accueil de ton dépôt.  
- Les gens comprendront immédiatement ton projet, comment l’installer et l’utiliser.  

👉 Veux-tu que je t’ajoute aussi un **exemple de script SQL `CREATE TABLE signalements`** dans
