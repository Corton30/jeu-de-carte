const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('../BD/connectionBD'); // Adjust the path to where your connectDB module is located
const { Utilisateur, History, Jeu } = require('../BD/UserModel'); // Adjust the path as needed

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();


// Middleware
app.use(bodyParser.json());

// Routes
app.post('/api/create-account', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Créer un utilisateur dans la base de données
        const user = new Utilisateur({ username, email, password });
        await user.save();
        res.json({ message: 'Compte créé avec succès!', user });
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
        const user = await Utilisateur.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }

        res.status(200).json({ message: 'Connexion réussie.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
});

function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer();
