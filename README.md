# Chain Stalker: NFT and Token Price Tracker

## 🤖 Use the hosted bot
You are free to set up your own bot or use the hosted version: [@ChainStalkerBot](https://t.me/ChainStalkerBot) on Telegram.

**Chain Stalker** helps users monitor NFT collections and token prices. It includes a Telegram bot that notifies users when an NFT or token changes price by a defined percentage or absolute value.

Currently integrated with:
- **Binance** — for token price updates
- **OpenSea** — for NFT listings and sales

> ⚠️ **Warning:** This tool is in active development. Features may change.

---

## 📦 Prerequisites
Before you begin, ensure you have:
- Docker & Docker Compose
- Node.js 18+
- A Telegram account
- An OpenSea API key (free to obtain)

---

## 🔧 Installation (Self-Hosted)

### Step 1: Download the release
Go to the **Releases** section and download version **0.1.1-alpha.2**. Extract it to your desired directory.

### Step 2: Get your API keys
You will need the following:
- Telegram Bot Token
- Telegram Bot Username
- OpenSea API Key  

> 💡 *Tip: Save all your keys in a text file for easy access.*

### Step 3: Obtain OpenSea API Key
The server uses the OpenSea Stream API to track NFTs. You need to [apply for a key here](https://docs.opensea.io/reference/api-keys).

> ❗ **Important:** Use a unique project name and avoid generic names like `test` or GitHub links like `https://github.com/test`.

### Step 4: Create Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Run `/newbot`
3. Provide:
   - Bot name
   - Bot username (must end with `bot`)
4. Copy the token provided

### Step 5: Run `.env` setup script
In the project root, run:

```bash
cd tools &&
npm i &&
npm run start
```

You will be prompted to answer required questions:
- **Telegram Bot Token**
- **Telegram Bot Username** (without `@`)
- **OpenSea API Key**

![Required questions](https://github.com/user-attachments/assets/5a811595-8e3d-44e9-94a9-ebf89d24283e)

Then you’ll be asked optional config questions:

![Optional section](https://github.com/user-attachments/assets/8082466e-57fb-406d-b18f-270d191c1256)

If you answer `yes`, you’ll be asked to enter your own values.  
**⚠ A space is considered a value**, so leave fields empty to accept the default. (press `Enter`)

![Final answer](https://github.com/user-attachments/assets/f64a70dd-5e6a-43b7-b1e6-b130a0967bc7)

Once complete, your `.env` file will be generated:

![Success](https://github.com/user-attachments/assets/a9aa88d8-01d3-4656-bbc1-ccf73d7c05aa)

---

## 🟢 Launching ChainStalker

Run the bot using Docker Compose:

```bash
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
