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

// добавление товаров
bot.on('message', (msg) => {
const chatId = msg.chat.id;
const item = msg.text;
let numberId = 0;
let i = 0;
// проверка для того, чтобы команды в список не добавлялись 
if (item != '/start' && item != '/clear') {
  addItemToShoppingList(chatId, item);
  // Добавление нумерации и вывод в виде: порядковый номер: товар
  if (shoppingList[chatId].length > 0) { 
    for (i = 0; i < shoppingList[chatId].length; i++) {
      numberId += 1;
      bot.sendMessage(chatId, `${numberId}: ${shoppingList[chatId][i]}`);
    }

  }

} else if (item === '/clear'){
// очитстить список
  bot.onText(/\/clear/, (msg) => {
  const chatId = msg.chat.id;
  shoppingList[chatId].length = 0;
  bot.sendMessage(chatId, `список удален`);
  });
}

// bot.sendMessage(chatId, `🍔 Купи: \n\n${shoppingList[chatId]}`);
});




