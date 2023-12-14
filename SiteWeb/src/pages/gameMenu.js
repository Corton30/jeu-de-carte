import React, { useState } from 'react';
import './gameMenu.css'; // Votre CSS personnalisé

function MenuPrincipalBataille({ username }) {
    const [parties, setParties] = useState([
       /*des exemples : 
        { id: 1, nom: 'Bataille Royale', date: '2023-04-01', joueurs: '4/5', etat: 'en attente' },
  { id: 2, nom: 'Conquête Éclair', date: '2023-04-02', joueurs: '2/5', etat: 'ouverte' },
  { id: 3, nom: 'Duel au Sommet', date: '2023-04-03', joueurs: '5/5', etat: 'complète' },*/
    ]); // Votre historique de parties
    const [showForm, setShowForm] = useState(false); // Pour afficher ou non le formulaire
    const [nomPartie, setNomPartie] = useState(""); // Pour stocker le nom de la nouvelle partie

    const handleCreerPartieClick = () => {
      setShowForm(true); // Afficher le formulaire
    };
  
    const handleNomPartieChange = (e) => {
      setNomPartie(e.target.value); // Mettre à jour le nom de la partie
    };
  
    const handleCreerPartieSubmit = (e) => {
      e.preventDefault();
      // Ici, ajoutez la logique pour créer la nouvelle partie avec le nomPartie
      setShowForm(false); // Masquer le formulaire après la création
    };
  
    return (
      <div className="menu-principal">
        <h1>Menu Principal</h1>
        <button onClick={handleCreerPartieClick}>Créer une Partie</button>
        
        {showForm && (
          <form onSubmit={handleCreerPartieSubmit}>
            <input
              type="text"
              value={nomPartie}
              onChange={handleNomPartieChange}
              placeholder="Entrez le nom de la partie"
              required
            />
            <button type="submit">Créer</button>
          </form>
        )}
  
        <h2>Historique des Parties</h2>
        {/* ... Reste du code pour l'affichage de l'historique ... */}
      </div>
    );
  }
  
  export default MenuPrincipalBataille;
