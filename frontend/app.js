document.getElementById('signalementForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const lieu = document.getElementById('lieu').value;
    const description = document.getElementById('description').value;
    const anonyme = document.getElementById('anonyme').checked; // true si coché
    const nom = document.getElementById('nom') ? document.getElementById('nom').value : ""; // champ caché si présent
    const message = document.getElementById('message');
    const suggestionBox = document.getElementById('suggestionBox');

    // Réinitialiser les messages
    message.textContent = '';
    message.style.color = '';
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
        suggestionBox.textContent = '';
    }

    try {
        const response = await fetch('/signalement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, lieu, description, nom, anonyme })
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = data.message || "✅ Signalement envoyé avec succès !";
            message.style.color = 'green';

            // ✅ Afficher la suggestion automatiquement selon le type
            if (suggestionBox) {
                let suggestion = "";
                switch (type) {
                    case "Déchet":
                        suggestion = "♻️ Suggestion : Utiliser les poubelles de tri.";
                        break;
                    case "Fuite d'eau":
                        suggestion = "💧 Suggestion : Signaler rapidement pour éviter le gaspillage.";
                        break;
                    case "Pollution":
                        suggestion = "🌍 Suggestion : Réduire l’usage de plastiques et sensibiliser autour de vous.";
                        break;
                    case "Éclairage inutile":
                        suggestion = "💡 Suggestion : Éteindre les lumières inutiles pour économiser l’énergie.";
                        break;
                    case "Gaspillage énergie":
                        suggestion = "⚡ Suggestion : Optimiser l’utilisation des appareils électriques.";
                        break;
                }
                if (suggestion !== "") {
                    suggestionBox.textContent = suggestion;
                    suggestionBox.style.display = 'block';
                }
            }

            // Réinitialiser le formulaire
            document.getElementById('signalementForm').reset();
        } else {
            message.textContent = data.message || '❌ Une erreur est survenue.';
            message.style.color = 'red';
        }
    } catch (error) {
        console.error('Connection error:', error);
        message.textContent = '❌ Erreur de connexion avec le serveur.';
        message.style.color = 'red';
    }
});

// Effacer les messages si l’utilisateur modifie le formulaire
document.getElementById('signalementForm').addEventListener('input', () => {
    const message = document.getElementById('message');
    const suggestionBox = document.getElementById('suggestionBox');
    message.textContent = '';
    message.style.color = '';
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
        suggestionBox.textContent = '';
    }
});
