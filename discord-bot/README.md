# DSA Study Bot - Discord Bot

A Discord bot that helps users learn Data Structures and Algorithms through daily challenges, quizzes, and AI-powered explanations.

## Features

- `/daily` - Get today's DSA challenge
- `/problem` - Get a random problem (filter by difficulty or topic)
- `/hint` - Get progressive hints for a problem
- `/quiz` - Take a quick DSA quiz with interactive buttons
- `/explain` - Get AI-powered explanations for DSA concepts

## Setup

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section and click "Add Bot"
4. Copy the bot token (you'll need this later)
5. Enable "Message Content Intent" under Privileged Gateway Intents
6. Go to "OAuth2" > "URL Generator"
7. Select scopes: `bot`, `applications.commands`
8. Select permissions: `Send Messages`, `Embed Links`, `Use Slash Commands`
9. Copy the generated URL and use it to invite the bot to your server

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `DISCORD_TOKEN` - Your bot token from step 1
- `DISCORD_CLIENT_ID` - Your application's client ID
- `DISCORD_GUILD_ID` - (Optional) Your test server ID for faster command deployment
- `GROQ_API_KEY` - Your Groq API key for AI features

### 3. Install Dependencies

```bash
cd discord-bot
npm install
```

### 4. Deploy Commands

```bash
npm run deploy-commands
```

### 5. Start the Bot

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## Deployment Options

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

### Railway / Render / Fly.io

1. Connect your repository
2. Set environment variables
3. Set build command: `npm run build`
4. Set start command: `npm start`

### PM2 (Self-hosted)

```bash
npm install -g pm2
npm run build
pm2 start dist/index.js --name dsa-bot
pm2 save
```

## Commands Reference

| Command | Description | Options |
|---------|-------------|---------|
| `/daily` | Get today's challenge | - |
| `/problem` | Random problem | `difficulty`, `topic` |
| `/hint` | Get a hint | `problem` (required) |
| `/quiz` | Take a quiz | - |
| `/explain` | AI explanation | `question` (required) |

## Project Structure

```
discord-bot/
├── src/
│   ├── commands/
│   │   ├── daily.ts
│   │   ├── problem.ts
│   │   ├── hint.ts
│   │   ├── quiz.ts
│   │   ├── explain.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── problems.ts
│   │   └── quizzes.ts
│   ├── deploy-commands.ts
│   └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
