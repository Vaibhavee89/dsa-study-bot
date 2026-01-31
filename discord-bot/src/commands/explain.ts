import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const data = new SlashCommandBuilder()
  .setName("explain")
  .setDescription("Get AI-powered explanation for a DSA concept or problem")
  .addStringOption(option =>
    option
      .setName("question")
      .setDescription("Your DSA question (e.g., 'How does quicksort work?')")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString("question", true);

  if (!GROQ_API_KEY) {
    await interaction.reply({
      content: "❌ AI features are not configured. Please set up the GROQ_API_KEY.",
      ephemeral: true
    });
    return;
  }

  await interaction.deferReply();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `You are a helpful DSA (Data Structures and Algorithms) tutor. 
Your goal is to help students understand concepts WITHOUT giving away complete solutions.
- Explain concepts clearly with examples
- Use analogies to make complex topics accessible
- Guide students to think through problems step by step
- Keep responses concise (under 1000 characters for Discord)
- Use code snippets sparingly and only for illustration
- Encourage the student to try implementing themselves`
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I couldn't generate a response.";

    // Split long responses if needed
    const chunks = splitMessage(aiResponse, 4000);

    const embed = new EmbedBuilder()
      .setTitle("🤖 DSA Explanation")
      .setDescription(chunks[0])
      .setColor(0x5865f2)
      .setFooter({ text: "DSA Study Bot • Powered by AI" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Send additional chunks as follow-up if needed
    for (let i = 1; i < chunks.length; i++) {
      const followUpEmbed = new EmbedBuilder()
        .setDescription(chunks[i])
        .setColor(0x5865f2);
      await interaction.followUp({ embeds: [followUpEmbed] });
    }
  } catch (error) {
    console.error("Error calling Groq API:", error);
    await interaction.editReply({
      content: "❌ Sorry, I encountered an error while processing your question. Please try again."
    });
  }
}

function splitMessage(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let currentChunk = "";

  const paragraphs = text.split("\n\n");
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 <= maxLength) {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = paragraph;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}
