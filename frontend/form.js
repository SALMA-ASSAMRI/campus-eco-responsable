// Attacher l’événement au formulaire
document.getElementById('signalementForm').addEventListener('submit', envoyerSignalement);

async function envoyerSignalement(event) {
    event.preventDefault();

    // Récupération des champs
    const type = document.getElementById('type').value;
    const lieu = document.getElementById('lieu').value;
    const description = document.getElementById('description').value;
    const nom = document.getElementById('nom').value;
    const anonyme = document.getElementById('anonyme').checked;

    // Construire l'objet à envoyer
    const data = {
        type,
        lieu,
        description,
        nom: anonyme ? "Anonyme" : nom,
        anonyme
    };

    try {
        // ✅ Route corrigée : POST vers /signalement (singulier)
        const response = await fetch('/signalement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            afficherConfirmation("✔️ Signalement enregistré avec succès !", "success", data.type);
        } else {
            afficherConfirmation("❌ Erreur lors de l’enregistrement du signalement.", "error", data.type);
        }
    } catch (error) {
        afficherConfirmation("❌ Problème de connexion au serveur.", "error", data.type);
    }
}

function afficherConfirmation(message, type, typeSignalement) {
    const confirmationDiv = document.getElementById('confirmationMessage');
    const suggestionBox = document.getElementById('suggestionBox');

    // Message principal
    confirmationDiv.textContent = message;
    confirmationDiv.style.display = "block";
    confirmationDiv.classList.remove("success", "error");
    confirmationDiv.classList.add(type);

    // ✅ Suggestions automatiques selon le type
    if (suggestionBox) {
        let suggestion = "";
        switch (typeSignalement) {
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
            suggestionBox.style.display = "block";
        } else {
            suggestionBox.style.display = "none";
        }
    }
}


