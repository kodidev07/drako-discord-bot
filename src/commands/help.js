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
    const clientId = interaction.client.user.id; 
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=1513184448177373244`;

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
      .addOptions(
        {
          label: "Menú principal",
          value: "principal"
        },
        {
          label: "Comandos de información",
          description: "/ping, /help, /avatar, /invite",
          value: "info",
          emoji: "ℹ️",
        },
        {
          label: "Comandos de Música",
          description: "/play, /queue, /skip, /stop, /set-volume",
          value: "music",
          emoji: "🎵",
        }
      );

    const selectRow = new ActionRowBuilder().addComponents(menu);

    const urlButton = new ButtonBuilder()
      .setLabel("Servidor de Soporte")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/zfR7NAhbAv");

    const button = new ButtonBuilder()
      .setLabel("Invitar a Drako")
      .setEmoji("💌")
      .setStyle(ButtonStyle.Link)
      .setURL(inviteUrl);

    // Botón que abre el modal de bug report
    const bugButton = new ButtonBuilder()
      .setCustomId("bug_report")
      .setLabel("Reportar Bug")
      .setStyle(ButtonStyle.Danger);

    const buttonRow = new ActionRowBuilder().addComponents(button, urlButton, bugButton);

    await interaction.reply({
      embeds: [embed],
      components: [selectRow, buttonRow],
    });
  },
};