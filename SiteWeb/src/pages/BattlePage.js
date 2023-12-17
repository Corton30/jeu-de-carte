import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './BattlePage.css';

function BattlePage () {
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        if (username) {
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
        }
    }, [username]);

    const handleUsername = () => {
        const inputName = prompt('Votre nom:');
        setUsername(inputName);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket) {
            socket.emit('chat message', messageInput);
            setMessageInput('');
        }
    };

    return (
        <div>
            <h1>Jeu De La Bataille</h1>
            {!username && <button onClick={handleUsername}>Set Username</button>}
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
            </div>
        </div>
    );
};

export default BattlePage;
