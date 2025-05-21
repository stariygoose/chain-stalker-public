# Chain Stalker: NFT and Token Price Tracker

## You are free to set up your own bot or use hosted version @chainstalker_bot in Telegram

**Chain Stalker** is an ongoing project designed to help users monitor NFT collections and track token prices. The project includes a Telegram bot that notifies users when the price of an NFT or token changes by a specified percentage or an absolute value difference. Currently, the bot is integrated with Binance to notify users of token price changes and with OpenSea to provide updates on NFT listings and price changes. 

> ⚠️ **Warning!** The tool is in development, and new features are being added. ⚠️


# Installation
As the first step, navigate to the **Releases** section and select version **0.1.0-alpha.1**. Once the bot archive has finished downloading, extract it to a directory of your choice.

The second step is to obtain the necessary API keys for the bot to function. 
> #### ❗For convenience, we recommend saving all your API keys in a text file.

### Opensea Stream API Installation
The server uses the Opensea Stream API to track NFT listings and sales. This is a crucial part of the server.  
To configure the Opensea Stream API, you need to obtain an API key. Follow this [guide](https://docs.opensea.io/reference/api-keys) to get your Opensea API Key.  
> #### ❗ Important advice:
> *To avoid getting banned by Opensea, do not use generic project names or GitHub links like* `test`, `https://github.com/test` *and etc.*

### Telegram Bot Installation
The core component of this project is the Telegram Bot. To create a Telegram bot, follow these steps:  
1. Open Telegram and search for `@BotFather`.
2. Start a chat with BotFather and send the command `/newbot`.
3. BotFather will ask for:

  - A name for your bot.  
  - A username for your bot (must end with bot).

4. After this, BotFather will provide your bot's API Key.

### Configuring the `.env` File  

To set up the `.env` file, you need to run the script located in the root directory of the bot using the following command:
```
cd tools &&
npm i &&
npm run start
```
The script will prompt you with three mandatory questions requiring the following information:  
- **Telegram Bot API Key**  
- **Telegram Bot Username** (without `@` prefix)
- **Opensea API Key**  

# PHOTO TO REPLACE

After these questions, you will be asked four optional questions. We recommend to provide your own credentials to better security.

# PHOTO TO REPLACE

Lastly, if you answered `yes` to the additional parameters, you will need to fill them in with your values. If you leave the field blank, the default value will remain. (A space is considered a value, so please be careful.)

# PHOTO TO REPLACE

If everything was filled out successfully, you will see that some project files have been created.

# PHOTO TO REPLACE

## Starting the Bot
Once all configurations are complete, start the bot using Docker Compose:  
```
docker-compose up --build
```
🎉 That's it! Your bot should now be up and running.  
You can test The Bot by sending `/start` in Telegram.