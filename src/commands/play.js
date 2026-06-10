const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
} = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("🎵 Reproduce una canción o playlist.")
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName("cancion")
        .setDescription("Nombre o URL de la canción.")
        .setRequired(true),
    ),

  async execute(interaction) {
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply({
        content: "❌ ``Debes estar en un canal de voz para usar este comando.``",
        ephemeral: true
      });
    }

    const botMember = interaction.guild.members.me;
    if (!botMember.permissionsIn(channel).has("Connect") ||
        !botMember.permissionsIn(channel).has("Speak")) {
      return interaction.reply({
        content: "❌ No tengo ``permisos`` para unirme o hablar en tu canal de voz.\n Comprueba que tengo permisos de ``Conectar al canal de voz``",
        ephemeral: true
      });
    }

    const player = useMainPlayer();
    const query = interaction.options.getString("cancion");

    try {
      const { track } = await player.play(channel, query, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
          },
          volume: 50,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 5000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 5000,
        },
      });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Canción añadida a la cola",
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle(track.title)
    .setURL(track.url)
    .setThumbnail(track.thumbnail)
    .addFields(
      { name: "🎤 Artista", value: `\`${track.author}\``, inline: true },
      { name: "⏱️ Duración", value: `\`${track.duration}\``, inline: true },
      { name: "🔗 Fuente", value: `\`${track.source}\`` ?? "\`Desconocida\`", inline: true },
    )
    .setFooter({text: `Pedido por ${interaction.user.tag}`})
    .setColor(16777215)
      await interaction.reply({ embeds: [embed]});

    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: `❌ No se pudo reproducir: \`${err.message}\``,
        ephemeral: true
      });
    }
  },
};