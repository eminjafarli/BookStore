import React, {useEffect, useState} from "react";
import styled from "styled-components";
import UploadBookModal from "./UploadBookModal";
import axios from "axios";
import {motion, AnimatePresence} from "framer-motion";
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
const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;
const BookInfo = styled.div`
    font-size: 16px;
`;

const EditButton = styled.button`
    padding: 8px 16px;
    background: #e0e0e0;
    color: #333;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background: #c7c7c7;
    }
`;
const DownloadButton = styled.button`
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
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");



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
    const handleDownload = async (book) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/api/books/download/${book.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error:", response.status, errorText);
                throw new Error("Failed to download file");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${book.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading file:", err);
        }
    };




    const handleBookAdded = () => {
        setNotification({message: "Book added successfully!", success: true});
        fetchBooks();
        setShowModal(false);
        setTimeout(() => {
            setNotification(null);
        }, 1500);
    };
    const sortedBooks = [...books].sort((a, b) => {
        const userIdNumber = parseInt(userId);

        const isAUser = a.user?.id === userIdNumber;
        const isBUser = b.user?.id === userIdNumber;

        if (isAUser && !isBUser) return -1;
        if (!isAUser && isBUser) return 1;
        return 0;
    });


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
            <Text>Logged in as {username}</Text>
            {role === "ADMIN" && (
            <Text>Your Role: {role}</Text>
            )}
            {sortedBooks.map((book) => {
                return (
                    <Card key={book.id}>
                        <BookInfo>
                            <strong>{book.title}</strong><br/>
                            Uploaded by {book.user?.name}<br/> at {book.uploadDate}
                        </BookInfo>
                    <ButtonGroup>
                        {(role === "ADMIN" || book?.user?.username === username) && (
                            <EditButton onClick={() => setEditBook(book)}>Edit</EditButton>
                        )}
                        <DownloadButton onClick={() => handleDownload(book)}>Download</DownloadButton>
                    </ButtonGroup>
                    </Card>
                );
            })}


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
                            setNotification({message: "Book updated successfully!", success: true});
                            setTimeout(() => setNotification(null), 1500);
                        }}
                        onBookDeleted={() => {
                            fetchBooks();
                            setNotification({message: "Book deleted successfully!", success: true});
                            setTimeout(() => setNotification(null), 1500);
                        }}
                    />
                )}
            </AnimatePresence>


            <AnimatePresence>
                {notification && (
                    <Notification
                        success={notification.success}
                        initial={{y: -100, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -100, opacity: 0}}
                        transition={{duration: 0.5}}
                    >
                        {notification.message}
                    </Notification>
                )}
            </AnimatePresence>
        </Container>
    );
}

export default BooksDashboard;
