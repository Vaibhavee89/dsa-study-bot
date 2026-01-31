import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { problems } from "../data/problems";

// Track hint levels per user per problem
const userHints = new Map<string, Map<string, number>>();

export const data = new SlashCommandBuilder()
  .setName("hint")
  .setDescription("Get a hint for a problem")
  .addStringOption(option =>
    option
      .setName("problem")
      .setDescription("Problem name (e.g., two-sum, 3sum)")
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const problemName = interaction.options.getString("problem", true).toLowerCase();
  const userId = interaction.user.id;

  const problem = problems.find(p => 
    p.id === problemName || 
    p.title.toLowerCase().includes(problemName) ||
    problemName.includes(p.id)
  );

  if (!problem) {
    await interaction.reply({
      content: `❌ Problem "${problemName}" not found. Use \`/problem\` to see available problems.`,
      ephemeral: true
    });
    return;
  }

  // Get or initialize user's hint level for this problem
  if (!userHints.has(userId)) {
    userHints.set(userId, new Map());
  }
  const userProblemHints = userHints.get(userId)!;
  const currentLevel = userProblemHints.get(problem.id) || 0;

  if (currentLevel >= problem.hints.length) {
    await interaction.reply({
      content: `🎓 You've seen all ${problem.hints.length} hints for **${problem.title}**! Try solving it now, or use \`/explain\` for a deeper discussion.`,
      ephemeral: true
    });
    return;
  }

  // Increment hint level
  userProblemHints.set(problem.id, currentLevel + 1);

  const embed = new EmbedBuilder()
    .setTitle(`💡 Hint ${currentLevel + 1}/${problem.hints.length} for ${problem.title}`)
    .setDescription(problem.hints[currentLevel])
    .setColor(0x5865f2)
    .setFooter({ text: `Use /hint again for the next hint • ${problem.hints.length - currentLevel - 1} hints remaining` });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function autocomplete(interaction: { options: { getFocused: () => string }; respond: (choices: { name: string; value: string }[]) => Promise<void> }) {
  const focusedValue = interaction.options.getFocused().toLowerCase();
  const filtered = problems
    .filter(p => p.title.toLowerCase().includes(focusedValue) || p.id.includes(focusedValue))
    .slice(0, 25);

  await interaction.respond(
    filtered.map(p => ({ name: p.title, value: p.id }))
  );
}
