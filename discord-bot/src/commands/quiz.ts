import { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ComponentType
} from "discord.js";
import { getRandomQuiz, QuizQuestion } from "../data/quizzes";

export const data = new SlashCommandBuilder()
  .setName("quiz")
  .setDescription("Take a quick DSA quiz");

export async function execute(interaction: ChatInputCommandInteraction) {
  const questions = getRandomQuiz(1);
  const question = questions[0];

  const embed = createQuestionEmbed(question);
  const row = createAnswerButtons(question);

  const response = await interaction.reply({
    embeds: [embed],
    components: [row],
    fetchReply: true
  });

  // Wait for button interaction
  try {
    const buttonInteraction = await response.awaitMessageComponent({
      componentType: ComponentType.Button,
      time: 30000, // 30 seconds to answer
      filter: (i: ButtonInteraction) => i.user.id === interaction.user.id
    });

    const selectedAnswer = parseInt(buttonInteraction.customId.split("_")[1]);
    const isCorrect = selectedAnswer === question.correctAnswer;

    const resultEmbed = new EmbedBuilder()
      .setTitle(isCorrect ? "✅ Correct!" : "❌ Incorrect")
      .setDescription(question.explanation)
      .setColor(isCorrect ? 0x00ff00 : 0xff0000)
      .addFields(
        { name: "Your Answer", value: question.options[selectedAnswer], inline: true },
        { name: "Correct Answer", value: question.options[question.correctAnswer], inline: true }
      )
      .setFooter({ text: "Use /quiz for another question!" });

    await buttonInteraction.update({
      embeds: [resultEmbed],
      components: []
    });
  } catch {
    // Timeout
    const timeoutEmbed = new EmbedBuilder()
      .setTitle("⏰ Time's up!")
      .setDescription(`The correct answer was: **${question.options[question.correctAnswer]}**`)
      .setColor(0xffaa00);

    await interaction.editReply({
      embeds: [timeoutEmbed],
      components: []
    });
  }
}

function createQuestionEmbed(question: QuizQuestion): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("🧠 DSA Quiz")
    .setDescription(question.question)
    .setColor(0x5865f2)
    .addFields(
      question.options.map((opt, i) => ({
        name: `${String.fromCharCode(65 + i)}`,
        value: opt,
        inline: true
      }))
    )
    .setFooter({ text: "You have 30 seconds to answer!" });
}

function createAnswerButtons(question: QuizQuestion): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    question.options.map((_, i) =>
      new ButtonBuilder()
        .setCustomId(`answer_${i}`)
        .setLabel(String.fromCharCode(65 + i))
        .setStyle(ButtonStyle.Primary)
    )
  );
}
