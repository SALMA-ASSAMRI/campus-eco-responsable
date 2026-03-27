// Attacher l’événement au formulaire
document.getElementById('signalementForm').addEventListener('submit', envoyerSignalement);

async function envoyerSignalement(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('signalementForm'));
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/signalements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            afficherConfirmation("✔️ Signalement enregistré avec succès !", "success");
        } else {
            afficherConfirmation("❌ Erreur lors de l’enregistrement du signalement.", "error");
        }
    } catch (error) {
        afficherConfirmation("❌ Problème de connexion au serveur.", "error");
    }
}

function afficherConfirmation(message, type) {
    const confirmationDiv = document.getElementById('confirmationMessage');
    confirmationDiv.textContent = message;
    confirmationDiv.style.display = "block";

    // Supprimer les anciennes classes
    confirmationDiv.classList.remove("success", "error");

    // Ajouter la classe selon le type (success ou error)
    confirmationDiv.classList.add(type);
}
