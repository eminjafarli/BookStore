import React, {useState, useEffect, useRef} from "react";
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

function EditBookModal({ book, onClose, onBookUpdated }) {
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

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const handleSubmit = async () => {
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
                alert("Failed to update book");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Something went wrong");
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
                    <Title>Edit Book</Title>
                    <Input
                        ref={titleRef}
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, fileRef)}
                        placeholder="Book Title"
                    />
                    <Input
                        ref={fileRef}
                        type="file"
                        name="file"
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, null)}
                        accept=".pdf,.epub,.jpg,.png"
                    />
                    <ButtonGroup>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Update Book</Button>
                    </ButtonGroup>
                </ModalWrapper>
            </Backdrop>
        </AnimatePresence>
    );
}

export default EditBookModal;