import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Wrapper = styled.div`
    height: 95vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    font-family: Arial, sans-serif;
`;

const Title = styled.h1`
    font-size: 36px;
    margin-bottom: 40px;
    color: #333;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 18px;
  font-size: 14px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #d9363e;
  }
`;


const ButtonGroup = styled.div`
    display: flex;
    gap: 20px;
`;

const Button = styled(motion.button)`
    padding: 16px 32px;
    font-size: 18px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    transition: 0.01s;

    &:hover {
        background-color: #0056b3;
    }
`;

function HomePage() {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <LogoutButton
                onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }}
            >
                Logout
            </LogoutButton>
            <Title>Welcome to BookStore App</Title>
            <ButtonGroup>
                <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/users-dashboard")}
                >
                    Users
                </Button>
                <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/books-dashboard")}
                >
                    Books
                </Button>
            </ButtonGroup>
        </Wrapper>
    );
}

export default HomePage;
