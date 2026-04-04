import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
    return (
        <>
            <header className="header">
                <div className="container header-container">
                    <h1>API Explorer</h1>
                    <nav className="main-nav">
                        <ul className="nav-list">
                            <li><NavLink to="/users" className="nav-btn">Пользователи</NavLink></li>
                            <li><NavLink to="/posts" className="nav-btn">Посты (CRUD)</NavLink></li>
                            <li><NavLink to="/facts" className="nav-btn">Кошачьи факты</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="container">
                <Outlet /> { }
            </main>
        </>
    );
};