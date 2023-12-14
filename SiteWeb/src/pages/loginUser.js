import React, { useState } from 'react';
import './loginUser.css'; // Assurez-vous que le chemin d'accès au CSS est correct

function ConnexionPage() {
    const [formData, setFormData] = useState({ pseudo: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique de connexion
    };

    return (
        <div className="auth-container">
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="pseudo"
                    placeholder="Nom d'utilisateur"
                    value={formData.pseudo}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit" className="auth-submit">Se connecter</button>
            </form>
            <div className="auth-footer">
                <a href="/create-account">Pas de compte ? S'inscrire</a>
            </div>
        </div>
    );
}

export default ConnexionPage;
