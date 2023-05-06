 My first javascript telegram bot: shopping list. 
===

## Get a token:
1. Find BotFather (*@BotFather*) and create a new bot;
2. Write token to access the HTTP API;
3. Create file ***token.js***;
4. In this file write this code:

```
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

module.exports = token;
```

## Server preparation (ubuntu):
1. Install *Node.js* and *npm*:
   
   ```
    sudo apt update

    sudo apt install nodejs

    sudo apt install npm

   ```
2. Create new folder:
   
   ```
   mkdir botshop
   ```

3. Go to folder ***botshop***:
   
   ```
   cd botshop
   ```

4. Create new project:

    ```
    npm init
    ```

5. Install ``npm`` dependence for telegram bot:

    ```
    npm install node-telegram-bot-api --save
    ```

   
6. Clone this bot.
7. Start bot on new window:
   
    ```
    screen -S botshop

    node index.js
    ```

8. For stop window push ***CTRL + A + D***.
9. If you want to get back to working with your bot:
    
    ```
    screen -r botshop
    ```


    ![Simpson](https://i.gifer.com/IG5z.gif)