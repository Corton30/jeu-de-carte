import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { SERVER_URL } from '../index';


function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                setMessage('Login successful');
//              ramy
                // Redirigez vers la page du menu principal en utilisant le nom d'utilisateur
//                const user = await response.json();
/****** MAJ */    navigate(`/game-choice?username=${username}`);   //MAJ *********/
            } else if (response.status === 401) {
                setMessage('Invalid username or password');
            } else {
                setMessage('Server error');
            }


            // if (response.status == 200) {
            // } else {
            //     // Gérez les erreurs de connexion ici (mauvais nom d'utilisateur ou mot de passe)
            //     console.error('Échec de la connexion');
            //}
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
                    value={username}
                    onChange={handleUsernameChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <button type="submit" className="auth-submit">Se connecter</button>
            </form>
            <div className="auth-footer">
                <a href="/create-account">Pas de compte ? S'inscrire</a>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default LoginPage;
