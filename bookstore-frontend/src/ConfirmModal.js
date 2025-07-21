import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

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
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
    font-size: 20px;
    margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;

    &:first-child {
        background: #e0e0e0;
        color: #333;
    }

    &:last-child {
        background: #dc3545;
        color: white;
    }

    &:hover:first-child {
        background: #c7c7c7;
    }

    &:hover:last-child {
        background: #b02a37;
    }
`;

const ConfirmModal = ({ title, onCancel, onConfirm }) => {
    return (
        <AnimatePresence>
            <Backdrop
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <ModalWrapper
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Title>{title}</Title>
                    <ButtonGroup>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button onClick={onConfirm}>Delete</Button>
                    </ButtonGroup>
                </ModalWrapper>
            </Backdrop>
        </AnimatePresence>
    );
};

export default ConfirmModal;
