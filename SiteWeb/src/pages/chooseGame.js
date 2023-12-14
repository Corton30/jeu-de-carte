import React, { useState } from 'react';
import './chooseGame.css'; // Assurez-vous que le chemin est correct

function GameSelectionPage({ username }) {
  const [selectedGame, setSelectedGame] = useState('');

  const games = {
    'Bataille': true,
    '01/24': false,
    '04/24': false
  };

  const handleGameSelect = (gameName) => {
    setSelectedGame(gameName);
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

export default GameSelectionPage;
