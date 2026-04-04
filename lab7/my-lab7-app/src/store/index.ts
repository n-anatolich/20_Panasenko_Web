import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type User, type Post, type CatFact } from '../types';

export const fetchUsers = createAsyncThunk<User[]>('api/fetchUsers', async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('Ошибка загрузки пользователей');
    return res.json();
});

export const fetchPosts = createAsyncThunk<Post[]>('api/fetchPosts', async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=4');
    if (!res.ok) throw new Error('Ошибка загрузки постов');
    return res.json();
});

export const createPost = createAsyncThunk<Post, Partial<Post>>('api/createPost', async (newPost) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ ...newPost, userId: 1 }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    return res.json();
});

export const updatePost = createAsyncThunk<Post, Post>('api/updatePost', async (post) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    return res.json();
});

export const deletePost = createAsyncThunk<number, number>('api/deletePost', async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
    return id;
});

export const fetchFact = createAsyncThunk<CatFact>('api/fetchFact', async () => {
    const res = await fetch('https://catfact.ninja/fact');
    if (!res.ok) throw new Error('Не удалось получить факт');
    return res.json();
});

// --- Слайс приложения ---
interface AppState {
    users: { data: User[]; loading: boolean; error: string | null };
    posts: { data: Post[]; loading: boolean; error: string | null };
    fact: { data: CatFact | null; loading: boolean; error: string | null };
}

const initialState: AppState = {
    users: { data: [], loading: false, error: null },
    posts: { data: [], loading: false, error: null },
    fact: { data: null, loading: false, error: null },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Users
        builder.addCase(fetchUsers.pending, (state) => { state.users.loading = true; state.users.error = null; });
        builder.addCase(fetchUsers.fulfilled, (state, action) => { state.users.loading = false; state.users.data = action.payload; });
        builder.addCase(fetchUsers.rejected, (state, action) => { state.users.loading = false; state.users.error = action.error.message || 'Ошибка'; });
        
        // Posts (GET, POST, PUT, DELETE)
        builder.addCase(fetchPosts.pending, (state) => { state.posts.loading = true; state.posts.error = null; });
        builder.addCase(fetchPosts.fulfilled, (state, action) => { state.posts.loading = false; state.posts.data = action.payload; });
        builder.addCase(createPost.fulfilled, (state, action) => { state.posts.data.unshift(action.payload); });
        builder.addCase(updatePost.fulfilled, (state, action) => {
            const index = state.posts.data.findIndex(p => p.id === action.payload.id);
            if (index !== -1) state.posts.data[index] = action.payload;
        });
        builder.addCase(deletePost.fulfilled, (state, action) => {
            state.posts.data = state.posts.data.filter(p => p.id !== action.payload);
        });

        // Facts
        builder.addCase(fetchFact.pending, (state) => { state.fact.loading = true; state.fact.error = null; });
        builder.addCase(fetchFact.fulfilled, (state, action) => { state.fact.loading = false; state.fact.data = action.payload; });
    }
});

export const store = configureStore({ reducer: { app: appSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;