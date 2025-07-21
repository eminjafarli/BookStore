import React, {useEffect, useRef, useState} from "react";
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
    margin-left: -13px;
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
    }
`;
const Select = styled.select`
    margin-left: -13px;
    width: 477px;
    height: 44px;
    padding: 12px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;

    &:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
    }
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
function EditUserModal({ user, onClose,onUserDeleted }) {
    const [formData, setFormData] = useState({ username: "", name: "", role: "" });
    const [notification, setNotification] = useState(null);
    const nameInputRef = useRef();
    const [showConfirmModal, setShowConfirmModal] = useState(false);


    const roles = ["ADMIN", "USER"];

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                name: user.name || "",
                role: user.role || "",
            });
        }
    }, [user]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleKeyDown = (e, nextInputRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextInputRef && nextInputRef.current) {
                nextInputRef.current.focus();
            } else {
                e.target.form.requestSubmit();
            }
        }
    };

    const handleDeleteUser = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/api/users/delete/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onUserDeleted?.();
            window.location.reload();
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setNotification({ message: "User updated successfully!", success: true });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setNotification({ message: "Failed to update user.", success: false });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setNotification({ message: "Something went wrong.", success: false });
        }
    };

    if (!user) return null;

    return (
        <>
            <AnimatePresence>
                <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ModalWrapper
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Title>Edit User</Title>
                        <form onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
                                autoFocus
                                required
                            />
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                ref={nameInputRef}
                                onKeyDown={(e) => handleKeyDown(e, null)}
                                required
                            />
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </Select>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px",marginBottom:"-12px",marginLeft:"-13px" }}>
                                <Button type="button" onClick={() => setShowConfirmModal(true)} style={{ background: "#dc3545", color: "#fff" }}>
                                    Delete
                                </Button>

                                <div style={{ display: "flex", gap: "10px",marginLeft:"255px" }}>
                                    <Button type="button" onClick={onClose}>
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
                {showConfirmModal && (
                    <ConfirmModal
                        title="Are you sure you want to delete this user?"
                        onCancel={() => setShowConfirmModal(false)}
                        onConfirm={handleDeleteUser}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default EditUserModal;