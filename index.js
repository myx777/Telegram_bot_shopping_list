// Инициализация токена и бота:
const TelegramBot = require('node-telegram-bot-api');
const token = require('./private/token');
const bot = new TelegramBot(token, { polling: true });

console.log('Bot has been started... nice work! ;)');

// Будет хранить списки покупок для каждого чата (используется chatId в качестве ключа)
const shoppingList = {};

// Добавляет новый элемент в список покупок для указанного чата
function addItemToShoppingList(chatId, item) {
  if (!shoppingList[chatId]) {
    shoppingList[chatId] = [];
  }
  shoppingList[chatId].push(item);
}

// Удаляет элемент из списка покупок по его индексу для указанного чата
function removeItemFromShoppingList(chatId, index) {
  if (shoppingList[chatId] && shoppingList[chatId][index]) {
    shoppingList[chatId].splice(index, 1);
  }
}

/*
При получении команды /start, инициализируется список покупок для чата, 
если его ранее не существовало. Затем бот отправляет приветственное сообщение.
*/
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Чтобы добавить товар в список, просто напиши его в чат.');
  shoppingList[chatId] = []; // Инициализация списка покупок для нового чата
});

// Обработчик сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const item = msg.text;
  if (item !== '/start' && item !== '/clear' && item !== '') {
    addItemToShoppingList(chatId, item);
    updateShoppingList(chatId);
  } else if (item === '/clear') {
    clearShoppingList(chatId);
  } else if (item === '') {
    bot.sendMessage(chatId, 'Напиши что-нибудь!');
  }
});

/*
Эта функция обновляет список покупок для чата и отправляет его в чат 
с кнопками для вычеркивания элементов. Она генерирует текст сообщения, 
содержащий список покупок и соответствующие кнопки для каждого элемента. 
Затем отправляет это сообщение с обновленным inline_keyboard.
 */
function updateShoppingList(chatId) {
    const messageText = shoppingList[chatId].map((item, index) => `${index + 1}. ${item}`).join('\n');
    const inlineKeyboard = shoppingList[chatId].map((item, index) => ([// Массив, так это ждет api телеги
      {
        text: `${index + 1}. ${item}`,
        callback_data: `🎃 ${index + 1}. ${item}`,
      }
    ]));
  
    bot.sendMessage(chatId, messageText, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
}
  
//Эта функция очищает список покупок для чата и отправляет сообщение об очистке
function clearShoppingList(chatId) {
  shoppingList[chatId] = [];
  bot.sendMessage(chatId, 'Список удален');
}

/*
Этот обработчик срабатывает, когда пользователь нажимает на кнопку вычеркивания 
элемента из списка покупок. Он извлекает информацию о вычеркиваемом элементе, удаляет 
его из списка и обновляет список, вызывая функцию updateShoppingList. Затем бот 
редактирует исходное сообщение (с кнопками) для отображения информации о вычеркнутом элементе.
*/ 
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const match = data.match(/^\🎃 (.+)$/);// Поиск по регулярному выражению

  if (match) {
    const index = parseInt(match[1], 10) - 1;
    const item = data.slice(5);

    removeItemFromShoppingList(chatId, index);
    updateShoppingList(chatId);
    bot.editMessageText(`Хохохо ${item} вычеркнут.`, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
    });
  }
});