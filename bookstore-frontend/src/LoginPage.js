import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/login", { username, password });
            localStorage.setItem("token", response.data.token);
            navigate("/users");
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginPage;
