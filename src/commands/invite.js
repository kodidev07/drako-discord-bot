const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("💌 Invitame a tu servidor")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    const clientId = interaction.client.user.id; // ✅ usa el ID real del bot automáticamente
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=1513184448177373244`;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Invita a ${interaction.client.user.username}`,
        iconURL: interaction.client.user.displayAvatarURL({ size: 4096 }),
      })
      .setDescription(
        `Si quieres invitar a <@${clientId}>, aquí tienes la invitación.`,
      )
      .setColor(16777215)
      .setFooter({
        text: "Made by kodidev",
        iconURL: interaction.client.user.displayAvatarURL({ size: 4096 }),
      });

    const button = new ButtonBuilder()
      .setLabel("Invitar a Drako")
      .setEmoji("💌")
      .setStyle(ButtonStyle.Link)
      .setURL(inviteUrl);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false,
    });
  },
};