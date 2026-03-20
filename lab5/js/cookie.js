/**
 * Модуль для управления сохранением состояния колоды.
 * @module CardStorage
 */

/**
 * Сохраняет массив данных карт в localStorage.
 * @param {Array<Object>} cardsArray - Массив объектов карт для сохранения.
 */
function saveCardsToStorage(cardsArray) {
    const dataString = JSON.stringify(cardsArray);
    localStorage.setItem('myDeck', dataString);
}

/**
 * Извлекает массив данных карт из localStorage.
 * @returns {Array<Object>|null} Массив объектов карт или null, если данных нет.
 */
function loadCardsFromStorage() {
    const dataString = localStorage.getItem('myDeck');
    if (!dataString) return null;
    try {
        return JSON.parse(dataString);
    } catch (e) {
        console.error("Ошибка чтения данных", e);
        return null;
    }
}