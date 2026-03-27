document.getElementById('signalementForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const lieu = document.getElementById('lieu').value;
    const description = document.getElementById('description').value;
    const anonyme = document.getElementById('anonyme').checked; // true si coché
    const nom = document.getElementById('nom').value; // récupère le champ caché
    const message = document.getElementById('message');

    // Réinitialiser le message
    message.textContent = '';
    message.style.color = '';

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

// Effacer le message si l’utilisateur modifie le formulaire
document.getElementById('signalementForm').addEventListener('input', () => {
    const message = document.getElementById('message');
    message.textContent = '';
    message.style.color = '';
});
