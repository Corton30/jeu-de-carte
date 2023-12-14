import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createUser.css';

function SignUpPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate(); // Use useNavigate inside a component

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/create-account', {
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
                // Redirect to the login page after successful registration
                navigate('/login'); // Use navigate here
            } else {
                // Handle registration errors here
                console.error("Registration failed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <h1>Créer un Compte</h1>
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
                <button type="submit" className="auth-submit">S'inscrire</button>
            </form>
            <div className="auth-footer">
                <a href="/login">Déjà un compte ? Connectez-vous</a>
            </div>
        </div>
    );
}

export default SignUpPage;
