const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("⏭️ Salta la canción actual.")
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "❌ No hay ninguna canción reproduciéndose.", ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: "❌ Debes estar en un canal de voz.", ephemeral: true });
    }

    const current = queue.currentTrack;
    queue.node.skip();

    const embed = new EmbedBuilder()
        .setAuthor({
      name: `⏭️ Canción saltada por ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL(),
    })
      .setDescription(`\`${current.title}\``)
      .setThumbnail(current.thumbnail)
      .setColor(16777215)


    await interaction.reply({ embeds: [embed] });
  },
};