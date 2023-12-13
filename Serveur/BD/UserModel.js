const mongoose = require('mongoose');

// User Schema
const schemaUtilisateur = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Utilisateur = mongoose.model('Utilisateur', schemaUtilisateur);

// Game History Schema
const schemaGameHistory = new mongoose.Schema({
    gameName: { type: String, required: true },
    username: { type: String, required: true },
    Card: [{ type: String }] // Modify according to the type of items in the array
});
const History = mongoose.model('History', schemaGameHistory);

// Game Schema
const schemaJeu = new mongoose.Schema({
    creator: { type: String, required: true, unique: true },
    gameName: { type: String, required: true, unique: true },
    GameState: { type: String, required: true },
    playerturn: { type: String, required: true }
});
const Jeu = mongoose.model('Jeu', schemaJeu);

// Export all models
module.exports = { Utilisateur, History, Jeu };
