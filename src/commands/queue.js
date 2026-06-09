const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("📋 Muestra la cola de canciones.")
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: "❌ No hay ninguna canción reproduciéndose.", ephemeral: true });
    }

    const current = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10); // máximo 10 en el embed

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Cola de reproducción",
        iconURL:
          "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
      })
      .addFields({
        name: "Reproduciendo ahora",
        value: `\`${current.title} — ${current.author}\` | \`Duración:\` \`${current.duration}\``,
      })
      .setThumbnail(current.thumbnail)
      .setColor(16777215)
      .setFooter({
        text: `${queue.tracks.size} canciones en cola`,
      });

    if (tracks.length > 0) {
      embed.addFields({
        name: "Siguiente en cola",
        value: tracks
          .map(
            (track, i) =>
              `\`${i + 1}.\` **${track.title}** — ${track.author} \`${track.duration}\``,
          )
          .join("\n"),
      });
    } else {
      embed.addFields({
        name: "Siguiente en cola",
        value: "``No hay más canciones en la cola.``",
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};