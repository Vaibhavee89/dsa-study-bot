import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { getDailyProblem } from "../data/problems";

export const data = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("Get today's DSA challenge");

export async function execute(interaction: ChatInputCommandInteraction) {
  const problem = getDailyProblem();

  const difficultyColors = {
    easy: 0x00ff00,
    medium: 0xffaa00,
    hard: 0xff0000,
  };

  const embed = new EmbedBuilder()
    .setTitle(`📅 Daily Challenge: ${problem.title}`)
    .setDescription(problem.description)
    .setColor(difficultyColors[problem.difficulty])
    .addFields(
      { name: "Difficulty", value: problem.difficulty.toUpperCase(), inline: true },
      { name: "Topics", value: problem.topics.join(", "), inline: true },
      { name: "💡 Need a hint?", value: "Use `/hint` to get progressive hints!" }
    )
    .setFooter({ text: "DSA Study Bot • Good luck!" })
    .setTimestamp();

  if (problem.leetcodeUrl) {
    embed.setURL(problem.leetcodeUrl);
  }

  await interaction.reply({ embeds: [embed] });
}
