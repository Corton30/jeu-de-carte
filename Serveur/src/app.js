const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();
const port = 3000;


// Enable CORS for all routes or for specific origins
app.use(cors());

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




// Démarrer le serveur
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    });
});