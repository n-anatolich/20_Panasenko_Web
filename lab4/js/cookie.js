/**
 * Устанавливает cookie
 * @param {string} name - Имя cookie
 * @param {string} value - Значение cookie (сохраняется в JSON формате)
 * @param {Object} options - Дополнительные параметры (например, expires)
 */
function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(JSON.stringify(value));

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

/**
 * Получает cookie по имени
 * @param {string} name - Имя cookie
 * @returns {any} Значение cookie или undefined
 */
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    if (matches) {
        try {
            return JSON.parse(decodeURIComponent(matches[1]));
        } catch (e) {
            return decodeURIComponent(matches[1]);
        }
    }
    return undefined;
}