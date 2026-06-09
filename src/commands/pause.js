const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("⏸️ Pausa o reanuda la canción actual.")
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "❌ No hay ninguna canción reproduciéndose.", ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: "❌ Debes estar en un canal de voz.", ephemeral: true });
    }

    const paused = queue.node.isPaused();
    paused ? queue.node.resume() : queue.node.pause();

    const embed = new EmbedBuilder()
      .setTitle(paused ? "▶️ Reanudado" : "⏸️ Pausado")
      .setDescription(
        paused
          ? `▶️ **${queue.currentTrack.title}** reanudada.`
          : `⏸️ **${queue.currentTrack.title}** pausada.`,
      )
      .setThumbnail(queue.currentTrack.thumbnail)
      .setColor(0x1db954)
      .setTimestamp()
      .setFooter({ text: `Por ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
  },
};