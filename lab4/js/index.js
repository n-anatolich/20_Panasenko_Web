document.addEventListener("DOMContentLoaded", () => {
    
    //  1. темная тема
    const themeToggleBtn = document.getElementById("theme-toggle");
    
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        themeToggleBtn.textContent = "☀️ Светлая тема";
    }

    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        
        if (isDark) {
            themeToggleBtn.textContent = "☀️ Светлая тема";
            localStorage.setItem("theme", "dark");
        } else {
            themeToggleBtn.textContent = "🌙 Тёмная тема";
            localStorage.setItem("theme", "light");
        }
    });


    //  2. лента отзывов
    const reviewForm = document.getElementById("review-form");
    const reviewList = document.getElementById("review-list");

    const defaultReviews = [
        {
            name: "Григорий бригадир",
            text: "Раньше уровни выкидывал, теперь просто заливаю новый пузырек из банки. Экономия колоссальная!",
            image: ""
        },
        {
            name: "ООО 'СтройМонтаж'",
            text: "Взяли оптом 5 банок на бригаду. Заказчик в шоке от идеальной геометрии наших стен.",
            image: "https://srbu.ru/images/instrument-i-oborudovanie/luchshie-puzirkovie-urovni/luchshie-puzirkovie-urovni.jpg"
        }
    ];

    // отзывы из cookie, если их нет - по умолчанию
    let savedReviews = getCookie("user_reviews");
    if (!savedReviews || !Array.isArray(savedReviews)) {
        savedReviews = defaultReviews;
        setCookie("user_reviews", savedReviews, { 'max-age': 3600 * 24 * 30 }); // храним 30 дней
    }

    function renderReviews() {
        reviewList.innerHTML = "";
        savedReviews.forEach(review => {
            const card = document.createElement("div");
            card.className = "review-card";
            
            let imgHTML = review.image ? `<img src="${review.image}" alt="Фото к отзыву" class="review-img">` : '';
            
            card.innerHTML = `
                <h3>${review.name}</h3>
                ${imgHTML}
                <p>${review.text}</p>
            `;
            reviewList.appendChild(card);
        });
    }

    renderReviews();

    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("review-name").value.trim();
        const textInput = document.getElementById("review-text").value.trim();
        const imageInput = document.getElementById("review-image").value.trim();

        if (nameInput.length < 2) {
            alert("Имя должно содержать хотя бы 2 символа!");
            return;
        }
        if (textInput.length < 10) {
            alert("Отзыв слишком короткий! Напишите хотя бы пару слов. (10 символов)");
            return;
        }

        const newReview = {
            name: nameInput,
            text: textInput,
            image: imageInput
        };

        savedReviews.unshift(newReview);
        
        setCookie("user_reviews", savedReviews, { 'max-age': 3600 * 24 * 30 });

        renderReviews();
        reviewForm.reset();
    });
});
