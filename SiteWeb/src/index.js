import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";

export const SERVER_URL = "http://localhost:3000";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <Router>
        <App />
    </Router>   
    </>

);
