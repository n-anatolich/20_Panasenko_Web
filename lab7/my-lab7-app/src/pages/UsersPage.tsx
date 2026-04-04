import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { Loader, ErrorMsg } from '../components/SharedUI';

export const UsersPage: React.FC = () => {
    const { data, loading, error } = useSelector((state: RootState) => state.app.users);

    return (
        <section className="content-section active">
            <h2>Список пользователей</h2>
            <Loader visible={loading} />
            <ErrorMsg message={error} />
            
            <div className="cards-grid">
                {data.map(user => (
                    <article key={user.id} className="card">
                        <h3>{user.name}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Компания:</strong> {user.company.name}</p>
                        <p><strong>Город:</strong> {user.address.city}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};