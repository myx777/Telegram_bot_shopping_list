const TelegramBot = require('node-telegram-bot-api');

// импортирем токен из файла token.js
const token = require('./private/token');

// подключаем токен к новому боту
const bot = new TelegramBot(token, { polling: true });

// чисто по кайфу, тобы на сервере была запись, что запустил сие чудо
console.log('Bot has been started... nice work! ;)');

// Создание списка покупок и функции добавления 
const shoppingList = [];

function addItemToShoppingList(chatId, item) {
if (!shoppingList[chatId]) {
  shoppingList[chatId] = [];
}
shoppingList[chatId].push(item);
}; 

// старт бота
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Чтобы добавить товар в список, просто напиши его в чат.');
});

// добавление товаров, очистка списка
bot.on('message', (msg) => {
const chatId = msg.chat.id;
const item = msg.text;
let numberId = 0;
// проверка для того, чтобы команды в список не добавлялись 
if (item != '/start' && item != '/clear' && item != '') {
  addItemToShoppingList(chatId, item);
  // Добавление нумерации и вывод в виде: порядковый номер: товар
  if (shoppingList[chatId].length > 0) { 
    for (let i = 0; i < shoppingList[chatId].length; i++) {
      numberId += 1;
      // bot.sendMessage(chatId, `${numberId}: ${shoppingList[chatId][i]}`);
      let buttonText = `${numberId}. ${shoppingList[chatId][i]}`;
      bot.sendMessage(chatId, buttonText, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🔴 ' + buttonText,
                callback_data: 'button_pressed'
              }
            ]
         ]
       }
      });

    }

  };

} else if (item === '/clear'){
// очистить список
  shoppingList[chatId].length = 0;
  bot.sendMessage(chatId, `список удален`);
  } else if (item === '') {
  bot.sendMessage(chatId, `напиши что-нибудь!`);
  };
  
});



// обработка кнопки
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  if (data === 'button_pressed') {
    const message = query.message.text;
    bot.answerCallbackQuery(query.id, { text: `Вы нажали на кнопку "${message}"` });
  }
