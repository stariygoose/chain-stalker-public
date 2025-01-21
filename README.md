# Chain Stalker: NFT and Token Price Tracker (Work in Progress)

**Chain Stalker** is an ongoing project designed to help users monitor NFT collections and track token prices. The project includes a Telegram bot that notifies users when the price of an NFT or token changes by a specified percentage. Currently, the tool is in development, and new features are being added.

# Roadmap

The development of **Chain Stalker** is organized in stages. Below is the current roadmap outlining completed tasks and upcoming features:

## 🚀 V1 - Initial Bot Release (Completed)
- ✅ **Telegram Bot for Token Price Alerts:** The bot is fully functional for tracking token prices.
- ✅ **Supported Exchanges:** Currently, the bot works only with Binance for token price tracking.
- ✅ **NFT Tracking:** Integration with OpenSea to track NFT floor price is complete.
- ✅ **User data wipe:** The ability to delete user data.

## 🌐 V1.1 - Website for Subscription Management (In Progress)
- ❌ **Bot interface for Managing Subscriptions:** Provide an interface for the bot to manage subscriptions.
- ❌ **Website for Managing Subscriptions:** A web interface will be developed to allow users to manage their tracked tokens and NFTs, as well as adjust alert settings.

## 🚀 V2 - Expanded Token Tracking (Planned)
- ❌ **V2 Bot:** The bot will be enhanced to support more centralized and decentralized exchanges, providing broader coverage for token price tracking.
- ❌ **Additional Exchange Integrations:** Plans to integrate with popular platforms beyond Binance (e.g., Coinbase, Uniswap, etc.).

Stay tuned for further updates as we continue to develop new features and expand the bot's capabilities. Contributions and suggestions are always welcome!


# Installation
First, clone the repository and navigate to the project directory:

```terminal
git clone https://github.com/stariygoose/chain-stalker-public.git chain-stalker
cd chain-stalker
```

Next rename `.env.example` to `.env`.
A `.env` file is a configuration file used to store environment variables.
### ⚠️ It is recommended not to change variables such as ports or any variables in lowercase format. ⚠️

The first four variables you can modify are `DB_USER`, `DB_PASS`, `DB_DATABASE` and `REDIS_PASSWORD`.  You are free to choose any value for these.

## Opensea Stream API Installation
The server uses the Opensea Stream API to track NFT listings and sales. This is a crucial part of the server.  
To configure the Opensea Stream API, you need to provide your API key in the `OPENSEA_TOKEN` variable. Follow this [guide](https://docs.opensea.io/reference/api-keys) to get your Opensea API Key.  
#### ❗ Important advice:
*To avoid getting banned by Opensea, do not use generic project names or GitHub links like* `test`, `https://github.com/test` *and etc.
Once you have your API Key, update the* `OPENSEA_TOKEN` *variable in the* `.env` *file with its value.*

## Telegram Bot Installation
The core component of this project is the Telegram Bot. To create a Telegram bot, follow these steps:  
1. Open Telegram and search for `@BotFather`.
2. Start a chat with BotFather and send the command `/newbot`.
3. BotFather will ask for:

    A name for your bot.  
    A username for your bot (must end with bot).

4. After this, BotFather will provide your bot's API Key. Copy the API Key and paste it into the `TG_BOT_TOKEN` variable in the `.env` file.
You will also need to configure the `TG_BOT_URL` variable, but this will be set up after the ngrok installation.

## Ngrok Installation
Ngrok is used to expose your local server to the internet. Follow these steps:
1. Visit [this link](https://dashboard.ngrok.com/login) and create a free Ngrok account.
2. Log in to your account, copy your Ngrok API Key, and create a Static Domain.
3. Update the `.env` file with the following:
   
   Paste your Ngrok API Key into the `NGROK_TOKEN` variable.  
   Paste your Static Domain into the `TG_BOT_URL` variable. Ensure it includes the `https://` prefix.
   
6. Additionally, edit the `ngrok.yml` file:
   
   Remove `.example` from the filename `ngrok.yml.example`.
   Replace the placeholder `YOUR_DOMAIN` with your actual Static Domain.
   ⚠️ **If you have changed the `TG_BOT_PORT` variable to a different value, you must also update the port in the `upstream: url:` to the new `TG_BOT_PORT` value.**
### ⚠️ Do not remove `https://` prefix from the `TG_BOT_URL` variable. ⚠️

https://github.com/user-attachments/assets/ce0d4886-9795-4057-92cf-91ef986178ca

## Starting the Bot
Once all configurations are complete, start the bot using Docker Compose:  
```terminal
docker-compose up --build
```
🎉 That's it! Your bot should now be up and running.  
You can test the bot by sending `/start` or `/menu` in Telegram.