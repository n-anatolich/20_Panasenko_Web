import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { fetchUsers, fetchPosts, type AppDispatch } from './store';
import { Layout } from './components/Layout';
import { UsersPage } from './pages/UsersPage';
import { PostsPage } from './pages/PostsPage';
import { FactsPage } from './pages/FactsPage';
import './index.css'; // Подключаем твой CSS

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/users" replace />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="posts" element={<PostsPage />} />
                <Route path="facts" element={<FactsPage />} />
            </Route>
        </Routes>
    );
};

export default App;