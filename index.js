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
  // второй вариант вывода списка покупок с нумерацией c помощью arr.map(function(item, index, array)
    let bottomMessage = `${shoppingList[chatId].map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
    bot.sendMessage(chatId, bottomMessage, {
      // добавление кнопки

      // inline_keyboard это массив, который содержит массивы кнопок, 
      // которые будут отображаться в виде строк в чате. 

      // Каждый элемент массива-кнопки это объект, который содержит информацию о кнопке, 
      // такую как ее текст и callback_data.

      // В данном коде используется метод массива map() для создания нового массива кнопок. 
      // Каждый элемент нового массива-кнопки это объект, который содержит текст кнопки (index - номер, item - товар) и callback_data (\done). 
            
      // Затем, этот массив кнопок используется как значение свойства inline_keyboard 
      // объекта reply_markup. reply_markup объекта bot.sendMessage() используется для 
      // настройки клавиатуры, которая будет отображаться в сообщении бота.
      
      // При нажатии на любую из кнопок, бот будет отправлять callback_query с callback_data, 
      // который был указан в свойстве callback_data соответствующей кнопки.
        
      reply_markup: {
        inline_keyboard: shoppingList[chatId].map((item, index) => [
         {
            text: `${index + 1}. ${item}`,
            callback_data: '/done'
         }
            
        ])
      };

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
  };

});