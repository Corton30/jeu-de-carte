import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from './pages/createUser';
import GameSelectionPage from './pages/chooseGame';
import MenuPrincipalBataille from './pages/gameMenu';
import ConnexionPage from './pages/loginUser';

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<ConnexionPage />} />
            <Route path="/create-account" element={<SignUpPage />} />
            <Route path="/game-choice" element={<GameSelectionPage />} />  
            <Route path="/bataille-menu" element={<MenuPrincipalBataille />} />            
        </Routes>
    );
};

export default App;