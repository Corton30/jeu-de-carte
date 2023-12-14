import React, { useState } from 'react';
import './createUser.css';

function SignUpPage() {
    const [formData, setFormData] = useState({ pseudo: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique d'inscription
    };

    return (
        <div className="auth-container">
            <h1>Créer un Compte</h1>
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
                <button type="submit" className="auth-submit">S'inscrire</button>
            </form>
            <div className="auth-footer">
                <a href="/login">Déjà un compte ? Connectez-vous</a>
            </div>
        </div>
    );
}
//<a href="#"> : Utiliser un # seul indique un lien ancre qui ne mène nulle part ; il est souvent utilisé comme un espace réservé.

export default SignUpPage;
