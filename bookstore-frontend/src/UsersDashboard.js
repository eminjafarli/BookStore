import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "./EditUserModal";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Container = styled.div`
    min-height: 100vh;
    background: #ffffff;
    font-family: Arial, sans-serif;
    padding: 40px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const Title = styled.h2`
    color: #333;
`;


const Card = styled.div`
    background: #f7f7f9;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 18px;
  font-size: 14px;
  background-color: grey;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: dimgrey;
  }
`;
const UserInfo = styled.div`
    font-size: 16px;
`;

const EditButton = styled.button`
    padding: 8px 16px;
    background-color: #28a745;
    color: white;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }
`;

function UsersDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/api/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(res => setUsers(res.data));
    }, []);

    return (
        <Container>
            <BackButton
                onClick={() => {
                    navigate("/home");
                }}
            >
                Back
            </BackButton>
            <Header>
                <Title>Users Dashboard</Title>
            </Header>

            {users.map(user => (
                <Card key={user.id}>
                    <UserInfo>
                        <strong>{user.username}</strong> — {user.name} <br />
                        📚 {user.books ? user.books.length : 0} books
                    </UserInfo>
                    <EditButton onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                    }}>
                        Edit
                    </EditButton>
                </Card>
            ))}

            {showEditModal && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditModal(false)}
                />
            )}

        </Container>
    );
}

export default UsersDashboard;
