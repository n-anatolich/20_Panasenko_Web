import React from 'react';

export const Loader: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;
    return <div className="loader">Загрузка данных...</div>;
};

export const ErrorMsg: React.FC<{ message: string | null }> = ({ message }) => {
    if (!message) return null;
    return <div className="error-msg">{message}</div>;
};