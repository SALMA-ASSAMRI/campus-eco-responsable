async function chargerStatistiques() {
    try {
        const response = await fetch('/statistiques');
        const result = await response.json();

        if (!result.success) {
            document.getElementById('statsBody').innerHTML = `
                <tr><td colspan="3">❌ Erreur lors du chargement des statistiques</td></tr>
            `;
            return;
        }

        const stats = result.data;
        const total = stats.nouveau + stats.en_cours + stats.traite;

        let rows = '';
        for (const [statut, nombre] of Object.entries(stats)) {
            const pourcentage = total > 0 ? ((nombre / total) * 100).toFixed(1) + '%' : '0%';
            rows += `
                <tr>
                    <td>${statut}</td>
                    <td>${nombre}</td>
                    <td>${pourcentage}</td>
                </tr>
            `;
        }

        document.getElementById('statsBody').innerHTML = rows;

    } catch (error) {
        console.error("❌ Erreur stats:", error);
        document.getElementById('statsBody').innerHTML = `
            <tr><td colspan="3">❌ Erreur de connexion au serveur</td></tr>
        `;
    }
}

// Charger les stats au démarrage
chargerStatistiques();
