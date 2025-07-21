import React, { useEffect, useState } from "react";
import styled from "styled-components";
import UploadBookModal from "./UploadBookModal";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {useNavigate} from "react-router-dom";
import EditBookModal from "./EditBookModal";


const Container = styled.div`
    min-height: 80vh;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
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


const AddButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 18px;
    font-size: 14px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }
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

const BookInfo = styled.div`
  font-size: 16px;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Notification = styled(motion.div)`
  position: fixed;
  top: 20px;
  left: 44%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  background: ${(props) => (props.success ? "#28a745" : "#dc3545")};
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

function BooksDashboard() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [editBook, setEditBook] = useState(null);
    const role = localStorage.getItem("role");


    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/books", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleBookAdded = () => {
        setNotification({ message: "Book added successfully!", success: true });
        fetchBooks();
        setTimeout(() => {
            setShowModal(false);
            setNotification(null);
        }, 1500);
    };

    return (
        <Container>
            {role === "USER" && (
            <LogoutButton
                onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }}
            >
                Logout
            </LogoutButton>
                )}
            {role === "ADMIN" && (
            <BackButton
                onClick={() => {
                    navigate("/home");
                }}
            >
                Back
            </BackButton>
                )}
            <Header>
                <Title>Books Dashboard</Title>
                <AddButton onClick={() => setShowModal(true)}>Add Book</AddButton>
            </Header>

            {books.map((book) => (
                <Card key={book.id}>
                    <BookInfo>
                        <strong>{book.title}</strong><br />
                        Uploaded by {book.user?.username}
                    </BookInfo>
                    {role === "ADMIN" && (
                    <EditButton onClick={() => setEditBook(book)}>Edit</EditButton>
                        )}
                </Card>
            ))}

            <AnimatePresence>
                {showModal && (
                    <UploadBookModal
                        onClose={() => setShowModal(false)}
                        onBookAdded={handleBookAdded}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {editBook && (
                    <EditBookModal
                        book={editBook}
                        onClose={() => setEditBook(null)}
                        onBookUpdated={() => {
                            fetchBooks();
                            setNotification({ message: "Book updated successfully!", success: true });
                            setTimeout(() => setNotification(null), 1500);
                        }}
                        onBookDeleted={() => {
                            fetchBooks();
                            setNotification({ message: "Book deleted successfully!", success: true });
                            setTimeout(() => setNotification(null), 1500);
                        }}
                    />
                )}
            </AnimatePresence>


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

export default BooksDashboard;
