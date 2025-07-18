import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import {AnimatePresence, motion} from "framer-motion";
import {jwtDecode} from "jwt-decode";

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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Notification = styled(motion.div)`
    position: fixed;
    top: 20px;
    left: 44%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    background: ${props => (props.success ? "#28a745" : "#dc3545")};
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
    transition: 0.2s;

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
    const [notification, setNotification] = useState(null);
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
                const token = data.token;

                const decoded = jwtDecode(token);
                console.log("Decoded JWT:", decoded);
                const role = decoded.role;

                localStorage.setItem("token", token);
                localStorage.setItem("role", role);

                setNotification({ message: "Successful Login!", success: true });

                setTimeout(() => {
                    if (role === "ADMIN") {
                        window.location.href = "/home";
                    } else if (role === "USER") {
                        window.location.href = "/books-dashboard";
                    } else {
                        window.location.href = "/login";
                    }
                }, 700);
            } else {
                setNotification({ message: "Invalid Credentials.", success: false });
                setTimeout(() => {
                    setNotification(null);
                }, 1500);
            }
        } catch (err) {
            setNotification({ message: "Error Occurred.", success: false });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
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

            <AnimatePresence>
                {notification && (
                    <Notification
                        success={notification.success}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {notification.message}
                    </Notification>
                )}
            </AnimatePresence>
        </Container>
    );
}

export default LoginPage;