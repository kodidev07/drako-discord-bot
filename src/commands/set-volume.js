const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-volume")
    .setDescription("🔊 Cambia el volumen de la reproducción.")
    .setContexts(InteractionContextType.Guild)
    .addIntegerOption((option) =>
      option
        .setName("volumen")
        .setDescription("Volumen entre 0 y 100.")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100),
    ),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "❌ No hay ninguna canción reproduciéndose.", ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: "❌ Debes estar en un canal de voz.", ephemeral: true });
    }

    const volume = interaction.options.getInteger("volumen");
    queue.node.setVolume(volume);

    const emoji = volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊";

    const embed = new EmbedBuilder()
      .setTitle(`${emoji} Volumen ajustado`)
      .setDescription(`El volumen ha sido cambiado a **${volume}%**`)
      .setColor(16777215)
      .setFooter({ text: `Pedido por ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};