import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";

const App = () => {
    return (
        <Routes>
            <Route path="/login" Component={LoginPage} />
        </Routes>
    );
};

export default App;