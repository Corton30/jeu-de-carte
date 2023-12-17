import React, { useState } from 'react';
import './GameMenu.css'; // Votre CSS personnalisé
import { SERVER_URL } from '../index';
import { useNavigate } from 'react-router-dom';


function GameMenu({ username }) {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false); // Pour afficher ou non le formulaire
    const [nomPartie, setNomPartie] = useState(""); // Pour stocker le nom de la nouvelle partie
    const handleCreerPartieClick = () => {
      setShowForm(true); // Afficher le formulaire
    };
    const handleNomPartieChange = (e) => {
      setNomPartie(e.target.value); // Mettre à jour le nom de la partie
    };
    //MAJ CreerPartieSUbmit
    const handleCreerPartieSubmit = (e) => {
      e.preventDefault();

    // Récupérer l'URL actuelle
    var urlCourante = window.location.href;
    // Créer un objet URL
    var urlObjet = new URL(urlCourante);
    // Récupérer les paramètres de l'URL en tant qu'objet
    var parametres = urlObjet.searchParams;
    // Accéder au paramètre 'username'
    var usernameFromURL = parametres.get('username');
      const gameName = document.getElementById("gameName").value;
      const gameData = {
          name: gameName,
          creator: usernameFromURL // ou tout autre paramètre que vous souhaitez envoyer
      };

      fetch(`${SERVER_URL}/create-game`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({gameData})
      })
      .then(response => response.json())
      .then(data => {
          console.log('Partie créée:', data);
          navigate(`/Battle?username=${encodeURIComponent(usernameFromURL)}&gameName=${encodeURIComponent(gameName)}`);
          // Vous pouvez ici mettre à jour l'état de parties avec la nouvelle partie créée
      })
      .catch((error) => {
          console.error('Erreur lors de la création de la partie:', error);
      });

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
            id="gameName"/>
             {/*MAJ*/}
            <button type="submit">Créer</button>
          </form>
        )}
  
        <h2>Historique des Parties</h2>
        {/* ... Reste du code pour l'affichage de l'historique ... */}
      </div>
    );
  }
  
  export default GameMenu;

