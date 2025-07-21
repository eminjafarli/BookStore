import React, {useRef, useState} from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Backdrop = styled(motion.div)`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const ModalWrapper = styled(motion.div)`
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    width: 100%;
    max-width: 450px;
    max-height: 210px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    margin-left: -13px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-right: -13px;
    margin-top: -1px;
`;
const Notification = styled(motion.div)`
    position: fixed;
    top: 20px;
    left: 42%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    background: ${props => (props.success ? "#28a745" : "#dc3545")};
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:first-child {
        background: #e0e0e0;
        color: #333;
    }

    &:last-child {
        background: #007bff;
        color: white;
    }

    &:hover:first-child {
        background: #c7c7c7;
    }

    &:hover:last-child {
        background: #0056b3;
    }
`;

function UploadBookModal({ onClose, onBookAdded, userId }) {
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({ title: "", file: null });
    const formRef = useRef();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const form = new FormData();
        form.append("title", formData.title);
        if (formData.file) form.append("file", formData.file);
        if (userId) form.append("userId", userId);

        try {
            const response = await axios.post("http://localhost:8080/api/books", form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 || response.status === 201) {
                onBookAdded?.();
                onClose();
            } else {
                setNotification({ message: "Failed to upload book", success: true });
            }
        } catch (err) {
            console.error("Upload error:", err);
            setNotification({ message: "Something went wrong", success: true });
        }
    };

    return (
        <AnimatePresence>
            <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ModalWrapper
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Title>Add New Book</Title>

                    <form ref={formRef} onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Book Title"
                            required
                        />
                        <Input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            accept=".pdf,.epub,.jpg,.png"
                            required
                        />
                        <ButtonGroup>
                            <Button type="button" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Add Book</Button>
                        </ButtonGroup>
                    </form>
                </ModalWrapper>
            </Backdrop>
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
        </AnimatePresence>
    );
}

export default UploadBookModal;