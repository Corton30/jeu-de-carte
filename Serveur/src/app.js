const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3000;

// Connexion à la base de données SQLite (vous pouvez utiliser un autre type de base de données)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'BD/database.bd',
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
        defaultValue: {
            players: [],
            currentPlayer: 0,
            deck: [],
            chat: [],
        },
    },
});

// Middleware
app.use(bodyParser.json());

// Routes


sequelize.sync()
  .then(async () => {
    // Créez un exemple d'utilisateur
    const exampleUser = await User.create({
      username: 'utilisateur1',
      password: 'motdepasse1',
    });

    console.log('Exemple d\'utilisateur créé:', exampleUser.toJSON());
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
  });

//endpoint d'inscription 
app.post('/create-account', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.json({ message: 'Compte créé avec succès!', user });
        res.sendFile('connection.html');
        res.redirect('/login');
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
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }

        res.status(200).json({ message: 'Connexion réussie.' });
        //redirection vers la page du menu principal
        res.redirect(`/nouvellePage?username=${user}`);
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
        res.redirect(`?gamename=${gamename}`);
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
        //redircetion vers la partie  avec l'id de la partie et le username de l'utilisateur
        res.json({ message: 'Vous avez rejoint la partie avec succès!', gameState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la connexion à la partie.' });
    }
});

// Endpoint pour démarrer une partie
app.post('/startGame', async (req, res) => {
    try {
        const { gameId } = req.body;
        const game = await Game.findByPk(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Partie non trouvée.' });
        }

        // Initialiser le jeu de cartes et le distribuer aux joueurs
        // La logique de jeu de cartes peut être implémentée ici
        // Mettre à jour l'état de la partie

        const updatedGameState = /* logique de distribution de cartes */
            await game.update({ gameState: updatedGameState });
        Socket.emit('demarrage', "la partie vient de commencer !");
        res.json({ message: 'La partie a démarré avec succès!', gameState: updatedGameState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors du démarrage de la partie.' });
    }
});

// Endpoint pour jouer un tour
app.post('/play-turn', async (req, res) => {
    try {
        const { gameId, username } = req.body;
        const game = await Game.findByPk(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Partie non trouvée.' });
        }

        // Logique pour traiter le tour de jeu, mise à jour de l'état de la partie

        const updatedGameState = /* logique de traitement du tour */
            await game.update({ gameState: updatedGameState });
        res.json({ message: 'Tour de jeu réussi!', gameState: updatedGameState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors du tour de jeu.' });
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

        io.emit('sauvegarde', "partie en pause et sauvegardée");

        res.json({ message: 'Partie mise en pause et sauvegardée avec succès!', savedGame });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise en pause et de la sauvegarde de la partie.' });
    }
});



// Endpoint pour charger une partie sauvegardée
app.post('/load-saved-game', async (req, res) => {
    try {
        io.emit('reprise de la partie', "la partie a repris");
        const { savedGameId } = req.body;
        const savedGame = await SavedGame.findByPk(savedGameId);

        if (!savedGame) {
            return res.status(404).json({ error: 'Partie sauvegardée non trouvée.' });
        }

        // Mettez en œuvre la logique pour charger une partie sauvegardée
        /*const loadedGame = await Game.findByPk(savedGame.gameId);
    
        if (!loadedGame) {
          return res.status(404).json({ error: 'Partie correspondante non trouvée.' });
        }*/

        // Mettre à jour l'état de la partie avec celui de la sauvegarde
        await loadedGame.update({ gameState: savedGame.gameState });

        res.json({ message: 'Partie sauvegardée chargée avec succès!', gameState: loadedGame.gameState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors du chargement de la partie sauvegardée.' });
    }
});

// Endpoint pour signaler l'abandon d'un joueur
app.post('/player-abandon', async (req, res) => {
    try {
        const { gameId, username } = req.body;
        const game = await Game.findByPk(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Partie non trouvée.' });
        }

        const gameState = game.gameState;

        // Trouver le joueur dans la liste des joueurs de la partie
        const abandoningPlayer = gameState.players.find(player => player.username === username);


        if (!abandoningPlayer) {
            return res.status(404).json({ error: 'Joueur non trouvé dans la partie.' });
        }

        // Marquer le joueur comme abandonné
        const playerAbondon = gameState.players.filter(player => player.username !== username);
        await game.update({ gameState: playerAbondon });
        //abandoningPlayer.isAbandoned = true;

        // Envoyer un message à tous les clients connectés pour informer de l'abandon du joueur
        io.emit('playerAbandoned', { gameId: game.id, username });

        res.json({ message: `Le joueur ${username} a été marqué comme abandonné.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la prise en compte de l\'abandon du joueur.' });
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

function comparerCartes(carte1, carte2) {
    const valeursCartes = {
        '2': 2, '3': 3, '4': 4, '5': 5,
        '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'J': 11, 'Q': 12,
        'K': 13, 'A': 14
    };

    const valeurCarte1 = valeursCartes[carte1.split(' ')[0]];
    const valeurCarte2 = valeursCartes[carte2.split(' ')[0]];

    if (!valeurCarte1 || !valeurCarte2) {
        throw new Error("Carte invalide");
    }

    if (valeurCarte1 > valeurCarte2) {
        return `${carte1} est plus fort que ${carte2}`;
    } else if (valeurCarte1 < valeurCarte2) {
        return `${carte1} est plus faible que ${carte2}`;
    } else {
        return `${carte1} et ${carte2} ont la même valeur`;
    }
}

// Démarrer le serveur
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    });
});