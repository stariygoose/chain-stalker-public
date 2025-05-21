# Chain Stalker: NFT and Token Price Tracker

**Chain Stalker** is an ongoing project designed to help users monitor NFT collections and track token prices. The project includes a Telegram bot that notifies users when the price of an NFT or token changes by a specified percentage. Currently, the bot is integrated with Binance to notify users of token price changes and with OpenSea to provide updates on NFT listings and price changes. 

> ⚠️ **Warning!** The tool is in development, and new features are being added. ⚠️

## 🔧 Installation (Self-Hosted)

# Installation
As the first step, navigate to the **Releases** section and select version **0.1.0-alpha.1**. Once the bot archive has finished downloading, extract it to a directory of your choice.

The second step is to obtain the necessary API keys for the bot to function. 
> #### ❗For convenience, I recommend saving all your API keys in a text file.

### Opensea Stream API Installation
We'll start with OpenSea.
The server uses the Opensea Stream API to track NFT listings and sales. This is a crucial part of the server.  
To configure the Opensea Stream API, you need to obtain an API key. Follow this [guide](https://docs.opensea.io/reference/api-keys) to get your Opensea API Key.  
> #### ❗ Important advice:
> *To avoid getting banned by Opensea, do not use generic project names or GitHub links like* `test`, `https://github.com/test` *and etc.*

### Ngrok Installation
Ngrok is used to expose your local server to the internet. Follow these steps:
1. Visit [this link](https://dashboard.ngrok.com/login) and create a free Ngrok account.
2. Log in to your account, copy [your Ngrok API Key](https://dashboard.ngrok.com/get-started/your-authtoken), and [create a Static Domain](https://dashboard.ngrok.com/domains).

### Telegram Bot Installation
The core component of this project is the Telegram Bot. To create a Telegram bot, follow these steps:  
1. Open Telegram and search for `@BotFather`.
2. Start a chat with BotFather and send the command `/newbot`.
3. BotFather will ask for:

If you answer `yes`, you’ll be asked to enter your own values.  
**⚠ A space is considered a value**, so leave fields empty to accept the default. (press `Enter`)

4. After this, BotFather will provide your bot's API Key.

### Configuring the `.env` File  

To set up the `.env` file, you need to run the script located in the root directory of the bot using the following command:
```
node replace_env.js
```
The script will prompt you with four questions for additional bot configuration. You should answer either `yes` or `no`. If you choose `no` for the question, the bot will use the default settings.

![{DFACEBDD-6905-44C2-B5CF-BF7209BF44C9}](https://github.com/user-attachments/assets/7880722b-ebf2-459a-9c92-488479249e8f)

After these questions, you will be asked five mandatory questions requiring the following information:  
- **Opensea API Key**  
- **Ngrok API Key**  
- **Telegram Bot API Key**  
- **Telegram Bot Username**  
- **Ngrok Static Domain**

![{E837DCD5-FD38-47C5-8FE2-D3DFCC6D1C58}](https://github.com/user-attachments/assets/6b939695-a929-4666-9e86-82f5db8123c5)

Lastly, if you answered `yes` to the additional parameters, you will need to fill them in with your values. If you leave the field blank, the default value will remain. (A space is considered a value, so please be careful.)

![{2F34CF72-7C5C-4E98-9BED-8000FF59B6EC}](https://github.com/user-attachments/assets/1f862ee9-b378-4958-b946-2b73c8c7c7da)

If everything was filled out successfully, you will see that some project files have been created.

![{9EB90637-82D8-4D17-AD55-95724FF80A2D}](https://github.com/user-attachments/assets/da34bf89-0979-4fe1-b9a4-e171c96fa89a)


## Starting the Bot
Once all configurations are complete, start the bot using Docker Compose:  
```
docker-compose up --build
```

When running correctly, you’ll see logs from `bot`, `server`, and `mongodb` containers.

> 📡 You can interact with the bot in Telegram by sending `/start`.

---

## 📬 Feedback & Contributions
- Pull requests and issues are welcome!
- Follow development updates in this repo.

---

Made with 🧠 by ChainStalker team.
