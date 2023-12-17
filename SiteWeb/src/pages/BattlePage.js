import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './BattlePage.css';

const App = () => {
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState(prompt('Votre nom:'));
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const mySocket = io();
        setSocket(mySocket);

        mySocket.emit('join', username);

        mySocket.on('chat message', (msg) => {
            setMessages((messages) => [
                ...messages,
                `${msg.user}: ${msg.message}`,
            ]);
        });

        mySocket.on('user joined', (msg) => {
            setMessages((messages) => [...messages, msg]);
        });

        mySocket.on('user left', (msg) => {
            setMessages((messages) => [...messages, msg]);
        });

        mySocket.on('user list', (users) => {
            setUsers(users);
        });

        return () => {
            mySocket.disconnect();
        };
    }, [username]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('chat message', messageInput);
        setMessageInput('');
    };

    return (
        <div>
            <h1>Jeu De La Bataille</h1>
            <ul id="messages">
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <ul id="users">
                {users.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
            <div id="chat">
                <form id="form" onSubmit={handleSubmit}>
                    <input
                        id="m"
                        autoComplete="off"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button>Envoyer</button>
                </form>
                {/*<button id="lancementPartie">Lancer la partie</button>
        <button id="sauvergarderPartie">Sauver la partie</button>
        <button id="jouerTour">Poser une carte</button>*/}
            </div>
        </div>
    );
};

export default App;