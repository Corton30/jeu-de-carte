import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginUser.css'; // Assurez-vous que le chemin d'accès au CSS est correct
import { SERVER_URL } from '../index';


function ConnexionPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${SERVER_URL}/create-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                // Redirigez vers la page du menu principal en utilisant le nom d'utilisateur
                const user = await response.json();
                navigate(`/nouvellePage?username=${user.username}`);
            } else {
                // Gérez les erreurs de connexion ici (mauvais nom d'utilisateur ou mot de passe)
                console.error('Échec de la connexion');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
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
