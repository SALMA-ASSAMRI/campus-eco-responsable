console.log("✅ liste.js est bien chargé !");

async function chargerSignalements() {
    const tableBody = document.getElementById('tableBody');

    try {
        const response = await fetch('/signalements');
        const result = await response.json();
        console.log("Données reçues :", result.data);

        if (!result.success || result.data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">Aucun signalement à afficher pour le moment.</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = '';

        result.data.forEach(signalement => {
            const auteur = signalement.anonyme == 1 
                ? "Anonyme" 
                : (signalement.nom || "—");

            const row = `
                <tr>
                    <td>${signalement.id}</td>
                    <td>${signalement.type}</td>
                    <td>${signalement.lieu}</td>
                    <td>${auteur}</td>
                    <!-- ✅ Statut affiché toujours "nouveau" -->
                    <td class="status-nouveau">nouveau</td>
                    <td>${new Date(signalement.date_creation).toLocaleString()}</td>
                    <td>
                        <select class="status-select" onchange="changerStatut(${signalement.id}, this.value)">
                            <option value="nouveau" ${signalement.statut === 'nouveau' ? 'selected' : ''}>En attente</option>
                            <option value="en_cours" ${signalement.statut === 'en_cours' ? 'selected' : ''}>En cours</option>
                            <option value="traite" ${signalement.statut === 'traite' ? 'selected' : ''}>Traité</option>
                        </select>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("❌ Erreur lors du chargement :", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7">❌ Erreur lors du chargement des signalements.</td>
            </tr>
        `;
    }
}

// ✅ Afficher toujours "nouveau" dans la colonne Statut
function afficherStatut(statut) {
    return "nouveau";
}

async function changerStatut(id, nouveauStatut) {
    try {
        const response = await fetch(`/signalement/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: nouveauStatut })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || 'Erreur lors de la mise à jour du statut.');
            return;
        }

        // Recharge la liste après mise à jour
        chargerSignalements();
    } catch (error) {
        alert('Erreur de connexion au serveur.');
    }
}

// 👉 Charger les signalements au démarrage
chargerSignalements();
