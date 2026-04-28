require("dotenv").config();
const { Client, GatewayIntentBits, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, REST, Routes } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {

  // 1. Slash command trigger
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "daily-report") {

      const modal = new ModalBuilder()
        .setCustomId("dailyReportModal")
        .setTitle("Daily Report");

      const summary = new TextInputBuilder()
        .setCustomId("summary")
        .setLabel("Summary")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const projects = new TextInputBuilder()
        .setCustomId("projects")
        .setLabel("Projects Worked On")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const issues = new TextInputBuilder()
        .setCustomId("issues")
        .setLabel("Issues / Blockers")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      const steps = new TextInputBuilder()
        .setCustomId("steps")
        .setLabel("Next Steps")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const row1 = new ActionRowBuilder().addComponents(summary);
      const row2 = new ActionRowBuilder().addComponents(projects);
      const row3 = new ActionRowBuilder().addComponents(issues);
      const row4 = new ActionRowBuilder().addComponents(steps);

      modal.addComponents(row1, row2, row3, row4);

      await interaction.showModal(modal);
    }
  }

  // 2. Modal submit handler
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "dailyReportModal") {

      const summary = interaction.fields.getTextInputValue("summary");
      const projects = interaction.fields.getTextInputValue("projects");
      const issues = interaction.fields.getTextInputValue("issues") || "None";
      const steps = interaction.fields.getTextInputValue("steps");

      const report = `
**📅 Daily Report — ${interaction.user.username}**

**Summary**
${summary}

**Projects Worked On**
${projects}

**Issues / Blockers**
${issues}

**Next Steps**
${steps}
      `;

      await interaction.reply({
        content: "Your report has been submitted ✅",
        ephemeral: true,
      });

      const channel = interaction.guild.channels.cache.find(
        c => c.name === "daily-reports"
      );

      if (channel) {
        channel.send(report);
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);