const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionContextType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("🖼️ Muestra el avatar de un usuario.")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    )
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario del que quieres ver el avatar.")
        .setRequired(true),
    ),

  async execute(interaction) {
    // Si no se menciona nadie, muestra el avatar del propio usuario
    const target = interaction.options.getUser("usuario") ?? interaction.user;

    // Obtener avatar en máxima calidad, con soporte de GIF si es animado
    const avatarURL = target.displayAvatarURL({ size: 4096, dynamic: true });
    const extension = target.avatar?.startsWith("a_") ? "jpg" : "png";
    const downloadURL = target.displayAvatarURL({ size: 4096, extension, forceStatic: false });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Avatar de ${target.tag}`,
        iconURL: avatarURL,
      })
      .setImage(avatarURL)
      .setColor(16777215)
      .setTimestamp();

    const downloadButton = new ButtonBuilder()
      .setLabel("Descargar Avatar")
      .setStyle(ButtonStyle.Link)
      .setURL(downloadURL);

    const row = new ActionRowBuilder().addComponents(downloadButton);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};