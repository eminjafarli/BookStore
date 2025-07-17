import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import UsersDashboard from "./UsersDashboard";

function App() {
    return (
        <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/users-dashboard" element={<UsersDashboard />} />
        </Routes>
    );
}

export default App;
