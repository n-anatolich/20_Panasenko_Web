document.addEventListener('DOMContentLoaded', () => {
    //  НАВИГАЦИЯ 
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Переключение активной кнопки
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Переключение активной секции
            const targetId = btn.getAttribute('data-target');
            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === targetId) {
                    sec.classList.add('active');
                    loadSectionData(targetId);
                }
            });
        });
    });

    // Вспомогательные функции для UI (заглушки)
    const toggleLoader = (section, show) => {
        const loader = document.getElementById(`${section}-loader`);
        if (show) loader.classList.remove('hidden');
        else loader.classList.add('hidden');
    };

    const showError = (section, message) => {
        const errorDiv = document.getElementById(`${section}-error`);
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        // Скрытие сообщения об ошибке через 5 секунд
        setTimeout(() => errorDiv.classList.add('hidden'), 5000); 
    };

    //  РОУТЕР ЗАГРУЗКИ ДАННЫХ 
    function loadSectionData(targetId) {
        if (targetId === 'users-section') loadUsers();
        if (targetId === 'posts-section') loadPosts();
        if (targetId === 'facts-section') loadCatFact();
    }


    //  1. API ПОЛЬЗОВАТЕЛЕЙ (Метод GET) 
    async function loadUsers() {
        const container = document.getElementById('users-container');
        // Предотвращение повторной загрузки данных
        if (container.innerHTML !== '') return; 

        toggleLoader('users', true);
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) throw new Error('Ошибка сети при загрузке пользователей');
            const users = await response.json();
            
            container.innerHTML = users.map(user => `
                <article class="card">
                    <h3>${user.name}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Компания:</strong> ${user.company.name}</p>
                    <p><strong>Город:</strong> ${user.address.city}</p>
                </article>
            `).join('');
        } catch (error) {
            showError('users', error.message);
        } finally {
            toggleLoader('users', false);
        }
    }


    //  2. API ПОСТОВ (Методы GET, POST, PUT, DELETE) 
    async function loadPosts() {
        const container = document.getElementById('posts-container');
        // Ограничение на одну загрузку
        if (container.innerHTML !== '') return;

        toggleLoader('posts', true);
        try {
            // Выполнение GET-запроса
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=4');
            if (!response.ok) throw new Error('Ошибка загрузки постов');
            const posts = await response.json();
            
            renderPosts(posts);
        } catch (error) {
            showError('posts', error.message);
        } finally {
            toggleLoader('posts', false);
        }
    }

    function renderPosts(posts) {
        const container = document.getElementById('posts-container');
        container.innerHTML = posts.map(post => `
            <article class="card" id="post-${post.id}">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <button class="action-btn warning" onclick="updatePost(${post.id})">Изменить (PUT)</button>
                <button class="action-btn danger" onclick="deletePost(${post.id})">Удалить (DELETE)</button>
            </article>
        `).join('');
    }

    // Обработка POST-запроса
    document.getElementById('btn-create-post').addEventListener('click', async () => {
        toggleLoader('posts', true);
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Новый тестовый пост',
                    body: 'Это тело нового поста, созданного через метод POST.',
                    userId: 1,
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });
            const newPost = await response.json();
            alert(`Успех (POST)! Создан пост с ID: ${newPost.id}`);
            // Имитация добавления элемента в DOM для демонстрации
        } catch (error) {
            showError('posts', 'Ошибка создания поста');
        } finally {
            toggleLoader('posts', false);
        }
    });

    // Обработка PUT-запроса (вызов из HTML-кнопки)
    window.updatePost = async (id) => {
        toggleLoader('posts', true);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: id,
                    title: 'ОБНОВЛЕННЫЙ ЗАГОЛОВОК',
                    body: 'Текст обновлен через метод PUT.',
                    userId: 1,
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });
            const updatedPost = await response.json();
            document.querySelector(`#post-${id} h3`).textContent = updatedPost.title;
            document.querySelector(`#post-${id} p`).textContent = updatedPost.body;
            alert(`Пост ${id} успешно обновлен (PUT)`);
        } catch (error) {
            showError('posts', 'Ошибка обновления поста');
        } finally {
            toggleLoader('posts', false);
        }
    };

    // Обработка DELETE-запроса (вызов из HTML-кнопки)
    window.deletePost = async (id) => {
        toggleLoader('posts', true);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                document.getElementById(`post-${id}`).remove();
                alert(`Пост ${id} успешно удален (DELETE)`);
            }
        } catch (error) {
            showError('posts', 'Ошибка удаления поста');
        } finally {
            toggleLoader('posts', false);
        }
    };


    //  3. API ФАКТОВ О КОТАХ (Метод GET) 
    async function loadCatFact() {
        toggleLoader('facts', true);
        const textElement = document.getElementById('fact-text');
        textElement.style.opacity = '0.5';

        try {
            const response = await fetch('https://catfact.ninja/fact');
            if (!response.ok) throw new Error('Не удалось получить факт');
            const data = await response.json();
            textElement.textContent = data.fact;
        } catch (error) {
            showError('facts', error.message);
            textElement.textContent = 'Ой, коты разбежались. Попробуйте еще раз.';
        } finally {
            textElement.style.opacity = '1';
            toggleLoader('facts', false);
        }
    }

    document.getElementById('btn-get-fact').addEventListener('click', loadCatFact);

    // Инициализация загрузки данных для первой вкладки при старте
    loadUsers();
});