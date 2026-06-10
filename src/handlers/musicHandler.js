const { Player } = require("discord-player");
const { SpotifyExtractor, SoundCloudExtractor, DefaultExtractors } = require("@discord-player/extractor");
const { EmbedBuilder } = require('discord.js');
module.exports = async (client, interaction) => {
  const player = new Player(client);
  player.extractors.register(SoundCloudExtractor, {});
  player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  await player.extractors.loadMulti(DefaultExtractors, SpotifyExtractor, SoundCloudExtractor);
  const embed1 = new EmbedBuilder()
    .setDescription("✅ ``No hay ninguna canción en la lista, saliendo del canal de voz.``")
    .setColor(16777215)
    
  player.events.on("playerStart", (queue, track) => {
      const embed = new EmbedBuilder()
    .setAuthor({
      name: "Reproduciendo ahora...",
      iconURL: "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
    })
    .setTitle(track.title)
    .setURL(track.url)
    .setThumbnail(track.thumbnail)
    .addFields(
      { name: "🎤 Artista", value: `\`${track.author}\``, inline: true },
      { name: "⏱️ Duración", value: `\`${track.duration}\``, inline: true },
      { name: "🔗 Fuente", value: `\`${track.source}\`` ?? "\`Desconocida\`", inline: true },
    )
    .setColor(16777215)
    queue.metadata.channel.send({
      embeds: [embed]
    });
  });
  player.events.on("emptyQueue", (queue) => {
    queue.metadata.channel.send({ embeds: [embed1] });
  });
  player.events.on("emptyQueue", (queue) => {
    queue.metadata.channel.send({ embeds: [embed1] });
  });
  const embed2 = new EmbedBuilder()
    .setDescription("👋 ``Canal de voz vacío, saliendo del canal de voz.``")
    .setColor(16777215)
  player.events.on("emptyChannel", (queue) => {
    queue.metadata.channel.send({ embeds: [embed2] });
  });

  player.events.on("error", (queue, err) => {
    console.error(`❌ Error en el player:`, err);
    queue.metadata.channel.send({ content: `❌ Error: ${err.message}` });
  });

  client.player = player;
  console.log("[MUSIC] Player de música cargado.");
};