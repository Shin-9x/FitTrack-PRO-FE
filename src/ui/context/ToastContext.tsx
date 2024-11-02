import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '../components/toast/Toast';
import { ToastType } from '../components/toast/ToastType';

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toastProps, setToastProps] = useState<{ message: string; type: ToastType; duration: number } | null>(null);

    const showToast = (message: string, type: ToastType, duration: number = 3000) => {
        setToastProps({ message, type, duration });
        setTimeout(() => setToastProps(null), duration);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toastProps && (
                <Toast
                    message={toastProps.message}
                    type={toastProps.type}
                    duration={toastProps.duration}
                    onClose={() => setToastProps(null)}
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast deve essere usato all'interno di un ToastProvider");
    }
    return context;
};