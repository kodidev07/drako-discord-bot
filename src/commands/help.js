const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("❔ Lista de comandos del bot.")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Drako",
        iconURL:
          "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
      })
      .setDescription(
        "Bienvenido al panel de ayuda, te permite ver los comandos disponibles de <@1513184448177373244>.",
      )
      .addFields({
        name: "Comandos",
        value:
          "> ``Puedes ver los comandos disponibles usando el menú de abajo``",
      })
      .setColor(16777215)
      .setFooter({
        text: "Made by kodidev",
        iconURL:
          "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
      });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("menu")
      .setPlaceholder("Selecciona una categoria")
      .addOptions({
        label: "Comandos de información",
        description: "/ping, /help, /avatar",
        value: "info",
        emoji: "ℹ️",
      },
      {
        label: "Menú principal",
        value: "principal"
      }
    );

    const selectRow = new ActionRowBuilder().addComponents(menu);

    const urlButton = new ButtonBuilder()
      .setLabel("Servidor de Soporte")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/zfR7NAhbAv");

    // Botón que abre el modal de bug report
    const bugButton = new ButtonBuilder()
      .setCustomId("bug_report")
      .setLabel("Reportar Bug")
      .setStyle(ButtonStyle.Danger);

    const buttonRow = new ActionRowBuilder().addComponents(urlButton, bugButton);

    await interaction.reply({
      embeds: [embed],
      components: [selectRow, buttonRow],
      ephemeral: true,
    });
  },
};