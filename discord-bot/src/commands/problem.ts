import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { getRandomProblem, getProblemByTopic } from "../data/problems";

export const data = new SlashCommandBuilder()
  .setName("problem")
  .setDescription("Get a random DSA problem")
  .addStringOption(option =>
    option
      .setName("difficulty")
      .setDescription("Filter by difficulty")
      .setRequired(false)
      .addChoices(
        { name: "Easy", value: "easy" },
        { name: "Medium", value: "medium" },
        { name: "Hard", value: "hard" }
      )
  )
  .addStringOption(option =>
    option
      .setName("topic")
      .setDescription("Filter by topic (e.g., arrays, graph, dp)")
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const difficulty = interaction.options.getString("difficulty") as "easy" | "medium" | "hard" | null;
  const topic = interaction.options.getString("topic");

  let problem;
  if (topic) {
    problem = getProblemByTopic(topic);
    if (!problem) {
      await interaction.reply({
        content: `❌ No problems found for topic "${topic}". Try: arrays, graph, dp, tree, string, etc.`,
        ephemeral: true
      });
      return;
    }
  } else {
    problem = getRandomProblem(difficulty || undefined);
  }

  const difficultyColors = {
    easy: 0x00ff00,
    medium: 0xffaa00,
    hard: 0xff0000,
  };

  const embed = new EmbedBuilder()
    .setTitle(`🎯 ${problem.title}`)
    .setDescription(problem.description)
    .setColor(difficultyColors[problem.difficulty])
    .addFields(
      { name: "Difficulty", value: problem.difficulty.toUpperCase(), inline: true },
      { name: "Topics", value: problem.topics.join(", "), inline: true },
      { name: "💡 Need help?", value: "Use `/hint` for hints or `/explain` to discuss approaches!" }
    )
    .setFooter({ text: "DSA Study Bot" })
    .setTimestamp();

  if (problem.leetcodeUrl) {
    embed.setURL(problem.leetcodeUrl);
  }

  await interaction.reply({ embeds: [embed] });
}
