import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    height: 97vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    font-family: Arial, sans-serif;
`;

const FormBox = styled.div`
    background: #F7F7F9;
    padding: 30px;
    border-radius: 10px;
    width: 350px;
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    font-weight: normal;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 12px -11px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    
`;

const Button = styled.button`
    width: 50%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    font-size: 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const SignUpLink = styled.div`
    margin-top: 15px;
    font-size: 14px;

    a {
        color: #007bff;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
`;

function LoginPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                alert("Login successful!");
                navigate("/users-dashboard");
            } else {
                alert("Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Error occurred");
        }
    };

    return (
        <Container>
            <FormBox>
                <form onSubmit={handleSubmit}>
                    <Title>Login</Title>
                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit">Login</Button>
                </form>

                <SignUpLink>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </SignUpLink>
            </FormBox>
        </Container>
    );
}

export default LoginPage;
