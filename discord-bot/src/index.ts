import { Client, GatewayIntentBits, Events, Collection, ChatInputCommandInteraction } from "discord.js";
import * as dotenv from "dotenv";
import * as commands from "./commands";

dotenv.config();

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("Missing DISCORD_TOKEN in environment variables");
  process.exit(1);
}

// Create client
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Store commands
interface Command {
  data: { name: string };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: unknown) => Promise<void>;
}

const commandCollection = new Collection<string, Command>();
commandCollection.set("daily", commands.daily);
commandCollection.set("problem", commands.problem);
commandCollection.set("hint", commands.hint);
commandCollection.set("quiz", commands.quiz);
commandCollection.set("explain", commands.explain);

// Ready event
client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ DSA Study Bot is online as ${readyClient.user.tag}`);
  console.log(`📊 Serving ${readyClient.guilds.cache.size} servers`);
});

// Interaction handler
client.on(Events.InteractionCreate, async (interaction) => {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const command = commandCollection.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      
      const errorMessage = "There was an error executing this command!";
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  }

  // Handle autocomplete
  if (interaction.isAutocomplete()) {
    const command = commandCollection.get(interaction.commandName);

    if (!command || !command.autocomplete) {
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(`Error in autocomplete for ${interaction.commandName}:`, error);
    }
  }
});

// Login
client.login(token);
