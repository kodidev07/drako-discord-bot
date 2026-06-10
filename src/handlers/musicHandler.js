const { Player } = require("discord-player");
const { SpotifyExtractor, SoundCloudExtractor } = require("@discord-player/extractor");
const {EmbedBuilder} = require('discord.js');
module.exports = async (client, interaction) => {
  const player = new Player(client, {
    skipFFmpeg: false,
  });

  player.extractors.register(SoundCloudExtractor, {});
  player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,         // ← nuevo
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // ← nuevo
  });
 const embed1 = new EmbedBuilder()
      .setDescription("✅ ``No hay ninguna canción en la lista, saliendo del canal de voz.``")
      .setColor(16777215)

    player.events.on("emptyQueue", (queue) => {
    queue.metadata.channel.send({embeds:[embed1]});
  });
 const embed2 = new EmbedBuilder()
      .setDescription("👋 ``Canal de voz vacío, saliendo del canal de voz.``")
      .setColor(16777215)
  player.events.on("emptyChannel", (queue) => {
    queue.metadata.channel.send({embeds:[embed2]});
  });

  player.events.on("error", (queue, err) => {
    console.error(`❌ Error en el player:`, err);
    queue.metadata.channel.send({ content: `❌ Error: ${err.message}` });
  });

  client.player = player;
  console.log("[MUSIC] Player de música cargado.");
};