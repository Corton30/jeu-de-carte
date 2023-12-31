import React, { useState } from 'react';
import './GameChoice.css'; // Assurez-vous que le chemin est correct
import { SERVER_URL } from '../index';


function GameChoice({ username }) {
  const [selectedGame, setSelectedGame] = useState('');

  const games = {
    'Bataille': true,
    '01/24': false,
    '04/24': false
  };

  const handleGameSelect = (gameName) => {
    setSelectedGame(gameName);
    const currentUrl = window.location.href;
    const urlObjet = new  URL(currentUrl);
    const params = urlObjet.searchParams;
    const username = params.get('username');
    window.location.href=`/bataille-menu?username=${username}`;
  };

  return (
    <div className="game-selection-container">
      <h1>Bonjour,</h1>
      <h1>Choisissez un jeu {username}</h1>
      <div className="tabs">
        {Object.keys(games).map(gameName => (
          <button 
            key={gameName}
            className={`tab ${selectedGame === gameName ? 'active' : ''}`}
            onClick={() => handleGameSelect(gameName)}
            disabled={!games[gameName]}
          >
            {gameName}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {selectedGame && games[selectedGame] && (
          <p>Vous avez sélectionné le jeu {selectedGame}. Le jeu est prêt à commencer!</p>
        )}
        {selectedGame && !games[selectedGame] && (
          <p>Le jeu {selectedGame} n'est pas encore disponible.</p>
        )}
      </div>
    </div>
  );
}

export default GameChoice;
