function playGame() {
    let startGame = confirm("Хотите сыграть в КАМЕНЬ НОЖНИЦЫ БУМАГА 2???????");
    if (!startGame) {
        alert("Очень жаль😭😭😭😭😭😭😭😭😭😭😭😭");
        return;
    }

    const options = ["камень", "ножницы", "бумага"];
    let userChoice = "";

    while (true) {
        userChoice = prompt("Сделайте выбор: камень, ножницы или бумага!!!!!!!!!!");
        
        if (userChoice === null) {
            alert("ВЫ отменили игру 😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭");
            return;
        }

        userChoice = userChoice.trim().toLowerCase();

        if (userChoice === "") {
            alert("Вы ничего не ввели! Попробуйте еще раз.");
        } else if (!options.includes(userChoice)) {
            alert("Некорректный ввод! Пожалуйста, введите именно 'камень', 'ножницы' или 'бумага'.");
        } else {
            break;
        }
    }

    const botChoice = options[Math.floor(Math.random() * 3)];
    let resultMessage = `Ваш выбор: ${userChoice}\nКомпьютер выбрал: ${botChoice}\n\n`;

    if (userChoice === botChoice) {
        resultMessage += "Ничья!";
    } else if (
        (userChoice === "камень" && botChoice === "ножницы") ||
        (userChoice === "ножницы" && botChoice === "бумага") ||
        (userChoice === "бумага" && botChoice === "камень")
    ) {
        resultMessage += "Вы победили! 🎉😎😉";
    } else {
        resultMessage += "Вы проиграли! 😢";
    }

    alert(resultMessage);
}
