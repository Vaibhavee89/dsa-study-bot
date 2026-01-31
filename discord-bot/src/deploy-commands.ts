import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import * as commands from "./commands";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.error("Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in environment variables");
  process.exit(1);
}

const commandsData = [
  commands.daily.data.toJSON(),
  commands.problem.data.toJSON(),
  commands.hint.data.toJSON(),
  commands.quiz.data.toJSON(),
  commands.explain.data.toJSON(),
];

const rest = new REST().setToken(token);

async function deployCommands() {
  try {
    console.log(`Started refreshing ${commandsData.length} application (/) commands.`);

    let data;
    if (guildId) {
      // Deploy to specific guild (faster for testing)
      data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commandsData }
      );
      console.log(`Successfully registered commands to guild ${guildId}`);
    } else {
      // Deploy globally (takes up to 1 hour to propagate)
      data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commandsData }
      );
      console.log("Successfully registered global commands");
    }

    console.log(`Successfully reloaded ${(data as unknown[]).length} application (/) commands.`);
  } catch (error) {
    console.error("Error deploying commands:", error);
  }
}

deployCommands();
