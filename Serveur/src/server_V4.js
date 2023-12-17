const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3002;

// Connexion à la base de données SQLite (vous pouvez utiliser un autre type de base de données)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

// Définir le modèle pour l'utilisateur
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Définir le modèle pour la partie
const Game = sequelize.define('Game', {
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameState: {
    type: DataTypes.JSON,
    defaultValue: {
      players: [],
      currentPlayer: 0,
      deck: [],
      chat: [],
    },
  },
});

// Définir le modèle pour la sauvegarde de la partie
const SavedGame = sequelize.define('SavedGame', {
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameState: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

// Middleware
app.use(bodyParser.json());

// Routes

//endpoint d'inscription 
app.post('/create-account', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Vérifier si l'utilisateur avec le même nom d'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { username } });

      if (existingUser) {
          return res.status(400).json({ error: 'Le nom d\'utilisateur existe déjà.' });
      }

      // Si l'utilisateur n'existe pas, créez-le
      const user = await User.create({ username, password });
      res.json({ message: 'Compte créé avec succès!', user });
//        res.sendFile('connection.html');
//        res.redirect('/login');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});



// Endpoint de connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Vérifiez si l'utilisateur existe
      const user = await User.findOne({ where: { username } });

      if (!user || user.password !== password ) {
          return res.status(401).json({ error: 'Nom d\'utilisateur ou Mot de passe incorrect.' });
      }
      else{
      res.status(200).json({ message: 'Connexion réussie.' });
      }
      //redirection vers la page du menu principal
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

//endpoint de la creation de la partie 
app.post('/create-game', async (req, res) => {
  try {
    const { creator, gameName } = req.body;
    const game = await Game.create({ creator, gameName });
    res.json({ message: 'Partie créée avec succès!', game });
    res.redirect(`/BattlePage?gamename=${gameName}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la partie' });
  }
});

//rejoindre une partie
app.post('/join-game', async (req, res) => {
    try {
      const { username, gameId } = req.body;
      const game = await Game.findByPk(gameId);
  
      if (!game) {
        return res.status(404).json({ error: 'Partie non trouvée.' });
      }
  
      const gameState = game.gameState;
      const playerExists = gameState.players.some(player => player.username === username);
  
      if (playerExists) {
        return res.status(400).json({ error: 'Vous êtes déjà dans la partie.' });
      }
  
      // Ajouter le joueur à la liste des joueurs de la partie
      gameState.players.push({
        username,
        cardsRemaining: 52, // Nombre initial de cartes
      });
  
      await game.update({ gameState });
      //redircetion vers la partie
      res.json({ message: 'Vous avez rejoint la partie avec succès!', gameState });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la connexion à la partie.' });
    }
  });

//endpoint de la gestion des tours 
app.post('/start-new-turn', async (req, res) => {
  try {
    const { gameId } = req.body;
    const game = await Game.findByPk(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Partie non trouvée.' });
    }

    const gameState = game.gameState;

    // Logique pour gérer le tour de jeu
    // Exemple générique : redistribuer toutes les cartes
    gameState.players.forEach(player => {
      player.cardsRemaining = 52; // Redistribuer toutes les cartes
    });

    // Mettre à jour l'état de la partie après le nouveau tour
    const updatedGameState = {
      ...gameState,
      currentPlayer: (gameState.currentPlayer + 1) % gameState.players.length,
    };

    await game.update({ gameState: updatedGameState });

    res.json({ message: 'Nouveau tour de jeu démarré!', gameState: updatedGameState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du démarrage du nouveau tour de jeu.' });
  }
});

// Endpoint pour mettre en pause et sauvegarder une partie
app.post('/pause-and-save-game', async (req, res) => {
  try {
    const { gameId } = req.body;
    const game = await Game.findByPk(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Partie non trouvée.' });
    }

    const gameState = game.gameState;

    // Logique pour mettre en pause et sauvegarder la partie
    const savedGame = await SavedGame.create({
      gameId: game.id,
      gameState: gameState,
    });

    res.json({ message: 'Partie mise en pause et sauvegardée avec succès!', savedGame });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise en pause et de la sauvegarde de la partie.' });
  }
});

// Endpoint pour charger une partie sauvegardée
app.post('/load-saved-game', async (req, res) => {
  try {
    const { savedGameId } = req.body;
    const savedGame = await SavedGame.findByPk(savedGameId);

    if (!savedGame) {
      return res.status(404).json({ error: 'Partie sauvegardée non trouvée.' });
    }

    // Mettez en œuvre la logique pour charger une partie sauvegardée
    const loadedGame = await Game.findByPk(savedGame.gameId);

    if (!loadedGame) {
      return res.status(404).json({ error: 'Partie correspondante non trouvée.' });
    }

    // Mettre à jour l'état de la partie avec celui de la sauvegarde
    await loadedGame.update({ gameState: savedGame.gameState });

    res.json({ message: 'Partie sauvegardée chargée avec succès!', gameState: loadedGame.gameState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du chargement de la partie sauvegardée.' });
  }
});

// Fonction pour générer un jeu de cartes standard (52 cartes)
function generateDeck() {
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank} of ${suit}`);
    }
  }

  return deck;
}

// Fonction pour mélanger un jeu de cartes
function shuffleDeck(deck) {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

// Démarrer le serveur
// Synchroniser les modèles avec la base de données et démarrer le serveur
async function startServer() {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Erreur de synchronisation avec la base de données:', error);
  }
}

startServer();