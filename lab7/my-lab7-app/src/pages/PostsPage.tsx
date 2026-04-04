import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch, createPost, updatePost, deletePost } from '../store';
import type { Post } from '../types';
import { Loader, ErrorMsg } from '../components/SharedUI';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editBody, setEditBody] = useState(post.body);

    const handleSave = () => {
        dispatch(updatePost({ ...post, title: editTitle, body: editBody }));
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <article className="card">
                <div className="edit-field">
                    <label>Заголовок поста:</label>
                    <input className="edit-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </div>
                <div className="edit-field">
                    <label>Содержимое (текст):</label>
                    <textarea className="edit-textarea" value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                </div>
                <div className="edit-actions">
                    <button className="action-btn success" onClick={handleSave}>Сохранить (PUT)</button>
                    <button className="action-btn" onClick={() => setIsEditing(false)}>Отмена</button>
                </div>
            </article>
        );
    }

    return (
        <article className="card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button className="action-btn warning" onClick={() => setIsEditing(true)}>Изменить (PUT)</button>
            <button className="action-btn danger" onClick={() => dispatch(deletePost(post.id))}>Удалить (DELETE)</button>
        </article>
    );
};

export const PostsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.app.posts);
    
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');

    const handleCreate = () => {
        if (!newTitle.trim() || !newBody.trim()) return alert('Заполните поля!');
        dispatch(createPost({ title: newTitle, body: newBody }));
        setNewTitle('');
        setNewBody('');
    };

    return (
        <section className="content-section active">
            <h2>Управление постами</h2>
            
            <div className="create-post-form">
                <input type="text" placeholder="Введите заголовок" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <textarea placeholder="Введите текст поста" value={newBody} onChange={e => setNewBody(e.target.value)} rows={3} />
                <button className="action-btn success" onClick={handleCreate}>Создать новый пост (POST)</button>
            </div>

            <Loader visible={loading} />
            <ErrorMsg message={error} />
            
            <div className="cards-grid">
                {data.map(post => <PostCard key={post.id} post={post} />)}
            </div>
        </section>
    );
};