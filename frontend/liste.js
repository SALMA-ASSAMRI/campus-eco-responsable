console.log("✅ liste.js est bien chargé !");

// Charger les signalements depuis le backend
fetch('/signalements')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const tbody = document.querySelector('#signalementsTable tbody');
      tbody.innerHTML = '';

      data.data.forEach(sig => {
        const tr = document.createElement('tr');

        // Format date lisible
        const date = new Date(sig.date_creation).toLocaleString('fr-FR');

        tr.innerHTML = `
          <td>${sig.id}</td>
          <td>${sig.type}</td>
          <td class="lieu-cell">${sig.lieu}</td>
          <td>${sig.nom || 'Anonyme'}</td>
          <td class="description-cell">${sig.description}</td>
          <td class="date-cell">${date}</td>
          <td class="statut">${sig.statut}</td>
          <td>
            <select class="action-select" data-id="${sig.id}">
              <option value="en_attente" ${sig.statut === 'en_attente' ? 'selected' : ''}>En attente</option>
              <option value="en_cours" ${sig.statut === 'en_cours' ? 'selected' : ''}>En cours</option>
              <option value="traite" ${sig.statut === 'traite' ? 'selected' : ''}>Traité</option>
            </select>
          </td>
        `;

        tbody.appendChild(tr);
      });

      appliquerCouleurs();

      // Gérer changement Action
      document.querySelectorAll('.action-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const id = e.target.dataset.id;
          const statut = e.target.value;

          // Mise à jour backend
          const res = await fetch(`/signalement/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut })
          });
          const result = await res.json();

          if (result.success) {
            const row = e.target.closest('tr');
            const statutCell = row.querySelector('.statut');
            statutCell.textContent = statut;
            appliquerCouleurs();
          } else {
            alert("❌ Erreur lors de la mise à jour du statut");
          }
        });
      });
    } else {
      const tbody = document.querySelector('#signalementsTable tbody');
      tbody.innerHTML = `
        <tr>
          <td colspan="8">❌ Erreur lors du chargement des signalements.</td>
        </tr>
      `;
    }
  })
  .catch(err => {
    console.error("❌ Erreur de connexion :", err);
    const tbody = document.querySelector('#signalementsTable tbody');
    tbody.innerHTML = `
      <tr>
        <td colspan="8">❌ Erreur de connexion au serveur.</td>
      </tr>
    `;
  });

// ✅ Fonction pour appliquer couleurs directement dans liste.js
function appliquerCouleurs() {
  document.querySelectorAll('.statut').forEach(cell => {
    cell.classList.remove('statut-traite', 'statut-encours', 'statut-attente');
    if (cell.textContent === 'traite') {
      cell.classList.add('statut-traite');
    } else if (cell.textContent === 'en_cours') {
      cell.classList.add('statut-encours');
    } else if (cell.textContent === 'en_attente') {
      cell.classList.add('statut-attente');
    }
  });
}


   