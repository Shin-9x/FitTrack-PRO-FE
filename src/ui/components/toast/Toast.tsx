import React, { useEffect } from 'react';
import './Toast.css';
import { ToastType } from './ToastType';

interface ToastProps {
    message: string;
    type: ToastType;
    duration: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast ${type}`}>
            {message}
        </div>
    );
};

export default Toast;