import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";

const Backdrop = styled(motion.div)`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;
const FileInputWrapper = styled.div`
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    margin-left: -13px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;

`;

const CustomFileLabel = styled.label`
    background: #e0e0e0;
    color: #333;
    padding: 8px 11px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    margin-left: -8px;
    transition: background 0.2s ease;
    &:hover {
        background: #c7c7c7;
    }
`;

const HiddenInput = styled.input`
    display: none;
`;

const FileName = styled.span`
    font-size: 14px;
    margin-left: 7px;
    color: #555;
`;

const ModalWrapper = styled(motion.div)`
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    width: 100%;
    max-width: 450px;
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

function EditBookModal({ book, onClose, onBookUpdated,onBookDeleted }) {
    const [existingFileName, setExistingFileName] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        title: book?.title || "",
        file: null,
    });
    const titleRef = useRef();
    const fileRef = useRef();

    useEffect(() => {
        setFormData({ title: book?.title || "", file: null });
    }, [book]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const getOriginalFileName = (filename) => {
        if (!filename) return "";
        const parts = filename.split("C:\\Users\\ASUS\\Desktop\\uploaded_books\\");
        return parts.length > 1 ? parts.slice(1).join("_") : filename;
    };

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };
    const handleDeleteBook = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`http://localhost:8080/api/books/${book.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onBookDeleted?.();
            window.location.reload();
        } catch (err) {
            console.error("Failed to delete book", err);
        }
    };
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const form = new FormData();
        form.append("title", formData.title);
        if (formData.file) {
            form.append("file", formData.file);
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/api/books/${book.id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                onBookUpdated();
                onClose();
            } else {
                setNotification({ message: "Failed to update book", success: false });
            }
        } catch (err) {
            console.error("Update error:", err);
            setNotification({ message: "Something went wrong", success: false });
        }
    };

    return (
        <AnimatePresence>
            {!isClosing && (
            <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}  transition={{ duration: 0.3 }}>
                <ModalWrapper
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <form onSubmit={handleSubmit}>
                        <Title>Edit Book</Title>
                        <Input
                            ref={titleRef}
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onKeyDown={(e) => handleKeyDown(e, fileRef)}
                            placeholder="Book Title"
                            required
                        />

                        <FileInputWrapper>
                            <CustomFileLabel htmlFor="fileInput">Choose File</CustomFileLabel>
                            <HiddenInput
                                id="fileInput"
                                type="file"
                                name="file"
                                onChange={handleChange}
                                accept=".pdf,.epub,.jpg,.png"
                            />
                            <FileName>
                                {formData.file
                                    ? formData.file.name
                                    : book?.filename
                                        ? getOriginalFileName(book.filename)
                                        : "No file chosen"}
                            </FileName>
                        </FileInputWrapper>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px",marginBottom:"-12px",marginLeft:"-13px" }}>
                            <Button type="button" onClick={() => setShowConfirmModal(true)} style={{ background: "#dc3545", color: "#fff" }}>
                                Delete
                            </Button>

                            <div style={{ display: "flex", gap: "10px",marginLeft:"255px" }}>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsClosing(true);
                                        setTimeout(onClose, 300);
                                    }}
                                >
                                    Cancel
                                </Button>


                                <Button type="submit">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </ModalWrapper>
            </Backdrop>
                )}
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
            <AnimatePresence>
                {showConfirmModal && (
                    <ConfirmModal
                        title="Are you sure you want to delete this book?"
                        onCancel={() => setShowConfirmModal(false)}
                        onConfirm={handleDeleteBook}
                    />
                )}

            </AnimatePresence>

        </AnimatePresence>

    );
}

export default EditBookModal;
