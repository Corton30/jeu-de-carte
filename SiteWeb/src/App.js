import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateAccount from './pages/CreateAccount';
import GameChoice from './pages/GameChoice';
import GameMenu from './pages/GameMenu';
import LoginPage from './pages/LoginPage';

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/game-choice" element={<GameChoice />} />  
            <Route path="/bataille-menu" element={<GameMenu />} />            
        </Routes>
    );
};

export default App;