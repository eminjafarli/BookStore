import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "./EditUserModal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    min-height: 80vh;
    background: #ffffff;
    font-family: Arial, sans-serif;
    padding: 40px;
`;
const SearchInput = styled.input`
  padding: 10px;
  width: 200px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
`;
const Group1 = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
const Text = styled.h2`
    color: #4F4F4F;
    font-size:20px;
`;

const Card = styled.div`
    background: #f7f7f9;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
    const [bookCounts, setBookCounts] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const [searchTerm, setSearchTerm] = useState("");
    const handleUserDeleted = (id) => {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
        setShowEditModal(false);
    };

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setUsers(res.data);
                res.data.forEach((user) => {
                    fetch(`http://localhost:8080/api/books/user/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    })
                        .then((res) => {
                            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                            return res.json();
                        })
                        .then((books) => {
                            setBookCounts((prev) => ({
                                ...prev,
                                [user.id]: books.length,
                            }));
                        })
                        .catch((err) =>
                            console.error(`Error fetching books for user ${user.id}:`, err)
                        );
                });
            });
    }, []);
    const filteredUsers = users.filter((user) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(lowerSearch) ||
            user.name.toLowerCase().includes(lowerSearch)
        );
    });

    return (
        <Container>
            <BackButton onClick={() => navigate("/home")}>Back</BackButton>
            <Header>
                <Title>Users Dashboard</Title>
            </Header>
            <Text>Logged in as {username}</Text>
            <Group1>
            <Text>Your Role: {role}</Text>
                <SearchInput
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

            </Group1>
            {filteredUsers.map((user) => (
                <Card key={user.id}>
                    <UserInfo>
                        <strong>{user.username}</strong> — {user.name}
                        <br />
                        📚 {bookCounts[user.id] !== undefined ? bookCounts[user.id] : "Error Occurred"} books
                    </UserInfo>
                    <EditButton
                        onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                        }}

                    >
                        Edit
                    </EditButton>
                </Card>
            ))}

            {showEditModal && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditModal(false)}
                    onUserDeleted={handleUserDeleted}
                />
            )}
        </Container>
    );
}

export default UsersDashboard;
