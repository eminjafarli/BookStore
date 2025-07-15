import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import Dashboard from "./UsersDashboard";

function App() {
    return (
        <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
