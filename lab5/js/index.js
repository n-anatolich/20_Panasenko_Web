// Базовый класс, инкапсуляция общих свойств и методов
class Card {
    constructor(id, name, cost, description) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.description = description;
        this.type = 'Base'; // Метка типа для восстановления из хранилища
    }

    // Метод для генерации HTML-кода карты с учетом режима правки
    getHTML(isEditMode) {
        if (isEditMode) {
            return `
                <article class="card" data-id="${this.id}">
                    <input type="text" class="edit-name" value="${this.name}">
                    <input type="number" class="edit-cost" value="${this.cost}">
                    <textarea class="edit-desc">${this.description}</textarea>
                    ${this.getSpecificEditFields()} <button class="btn-delete" onclick="deleteCard(${this.id})">X</button>
                    <button onclick="saveCardEdits(${this.id})">Сохранить</button>
                </article>
            `;
        }
        return `
            <article class="card" data-id="${this.id}">
                <h3>${this.name}</h3>
                <p><strong>Мана:</strong> ${this.cost}</p>
                <p>${this.description}</p>
                ${this.getSpecificHTML()} <button class="btn-delete" onclick="deleteCard(${this.id})">Удалить</button>
            </article>
        `;
    }

    // Методы-заглушки для реализации полиморфизма в наследниках
    getSpecificHTML() { return ''; }
    getSpecificEditFields() { return ''; }
}

// Наследование, классы конкретных типов карт 

class AlienPlant extends Card {
    constructor(id, name, cost, description, healingPower) {
        super(id, name, cost, description); // Вызов конструктора родителя
        this.type = 'AlienPlant';
        this.healingPower = healingPower;
    }
    // Переопределение методов для отображения уникальных свойств типа
    getSpecificHTML() {
        return `<p><strong>Восстановление:</strong> ${this.healingPower} HP</p>`;
    }
    getSpecificEditFields() {
        return `<input type="number" class="edit-heal" value="${this.healingPower}" placeholder="HP">`;
    }
}

class PyramidArtifact extends Card {
    constructor(id, name, cost, description, healthPreservation) {
        super(id, name, cost, description);
        this.type = 'PyramidArtifact';
        this.healthPreservation = healthPreservation;
    }
    getSpecificHTML() {
        return `<p><strong>Защита здоровья:</strong> ${this.healthPreservation}%</p>`;
    }
    getSpecificEditFields() {
        return `<input type="number" class="edit-protect" value="${this.healthPreservation}" placeholder="Защита %">`;
    }
}

class CosmicSpell extends Card {
    constructor(id, name, cost, description, duration) {
        super(id, name, cost, description);
        this.type = 'CosmicSpell';
        this.duration = duration;
    }
    getSpecificHTML() {
        return `<p><strong>Длительность:</strong> ${this.duration} хода</p>`;
    }
    getSpecificEditFields() {
        return `<input type="number" class="edit-duration" value="${this.duration}" placeholder="Ходы">`;
    }
}

// Глобальное состояние приложения
let deck = []; // Массив объектов карт
let isEditMode = false; // Флаг режима интерфейса

// Набор данных для первичной инициализации
const defaultCards = [
    new AlienPlant(1, 'Бамбук с Нибиру', 2, 'Адаптируется к любой среде.', 5),
    new PyramidArtifact(2, 'Медная Пирамида', 4, 'Гармонизирует энергию и лечит раны.', 30),
    new CosmicSpell(3, 'Сигнал пришельцев', 3, 'Открывает карту противника.', 2)
];

// Фабричная функция для восстановления методов классов из JSON-данных
function hydrateCard(data) {
    switch (data.type) {
        case 'AlienPlant': return new AlienPlant(data.id, data.name, data.cost, data.description, data.healingPower);
        case 'PyramidArtifact': return new PyramidArtifact(data.id, data.name, data.cost, data.description, data.healthPreservation);
        case 'CosmicSpell': return new CosmicSpell(data.id, data.name, data.cost, data.description, data.duration);
        default: return new Card(data.id, data.name, data.cost, data.description);
    }
}

// Инициализация приложения
function initApp() {
    const savedData = loadCardsFromStorage(); // Загрузка данных из cookie.js
    if (savedData && savedData.length > 0) {
        deck = savedData.map(hydrateCard); // Восстановление экземпляров классов
    } else {
        deck = [...defaultCards]; // Использование дефолтного набора
    }
    buildDOM(); // Отрисовка страницы
}

// Функция полной пересборки DOM (формирование <body> на основе данных)
function buildDOM() {
    document.body.innerHTML = ''; // Очистка текущего содержимого

    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Колода карт</h1>
        <div>
            <select id="cardTypeSelect">
                <option value="AlienPlant">Растение</option>
                <option value="PyramidArtifact">Артефакт</option>
                <option value="CosmicSpell">Заклинание</option>
            </select>
            <button onclick="addSelectedCard()">Добавить карту</button>
            <button onclick="toggleEditMode()">${isEditMode ? 'Выйти из правки' : 'Режим правки'}</button>
        </div>
    `;

    const main = document.createElement('main');
    main.className = 'deck';
    main.innerHTML = deck.map(card => card.getHTML(isEditMode)).join(''); // Генерация HTML

    document.body.appendChild(header);
    document.body.appendChild(main);
}

// Переключение режима правки
function toggleEditMode() {
    isEditMode = !isEditMode;
    buildDOM(); // Перерисовка интерфейса
}

// Удаление карты из колоды
function deleteCard(id) {
    deck = deck.filter(card => card.id !== id); // Фильтрация массива по ID
    saveCardsToStorage(deck); // Синхронизация с localStorage
    buildDOM(); // Обновление страницы
}

// Добавление новой карты выбранного типа
function addSelectedCard() {
    const type = document.getElementById('cardTypeSelect').value; // Получение типа из селектора
    const newId = Date.now(); // Генерация ID через timestamp
    let newCard;

    // Логика создания объекта в зависимости от выбора
    switch (type) {
        case 'AlienPlant':
            newCard = new AlienPlant(newId, 'Новое растение', 1, 'Описание растения', 1);
            break;
        case 'PyramidArtifact':
            newCard = new PyramidArtifact(newId, 'Новый артефакт', 1, 'Описание артефакта', 10);
            break;
        case 'CosmicSpell':
            newCard = new CosmicSpell(newId, 'Новое заклинание', 1, 'Описание заклинания', 1);
            break;
    }

    if (newCard) {
        deck.push(newCard); // Добавление в массив
        saveCardsToStorage(deck); // Синхронизация с localStorage
        buildDOM(); // Перерисовка страницы
    }
}

// Сохранение отредактированных данных
window.saveCardEdits = function(id) {
    const cardElement = document.querySelector(`.card[data-id="${id}"]`); // Поиск DOM-узла
    const card = deck.find(c => c.id === id); // Поиск объекта в памяти
    
    if (card) {
        // Чтение данных из полей ввода
        card.name = cardElement.querySelector('.edit-name').value;
        card.cost = cardElement.querySelector('.edit-cost').value;
        card.description = cardElement.querySelector('.edit-desc').value;
        
        // Обновление специфических свойств в зависимости от типа
        if (card.type === 'AlienPlant') card.healingPower = cardElement.querySelector('.edit-heal').value;
        if (card.type === 'PyramidArtifact') card.healthPreservation = cardElement.querySelector('.edit-protect').value;
        if (card.type === 'CosmicSpell') card.duration = cardElement.querySelector('.edit-duration').value;
        
        saveCardsToStorage(deck); // Синхронизация с localStorage
        buildDOM(); // Перерисовка страницы
    }
};

// Выполнение скрипта после загрузки DOM
window.addEventListener('DOMContentLoaded', initApp);