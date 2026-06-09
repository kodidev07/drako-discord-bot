const { EmbedBuilder } = require('discord.js');

/**
 * Crea el embed estilo Spotify para "Now Playing"
 */
function createNowPlayingEmbed(song, queue, member) {
  const progressBar = buildProgressBar(0, song.duration); // DisTube no expone el tiempo actual fácilmente en v4
  const loopMode = getLoopLabel(queue.repeatMode);

  const embed = new EmbedBuilder()
    .setColor(0x1DB954) // Verde Spotify
    .setAuthor({
      name: '🎵  Now Playing',
      iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/232px-Spotify_icon.svg.png',
    })
    .setTitle(song.name)
    .setURL(song.url)
    .setThumbnail(song.thumbnail)
    .addFields(
      {
        name: '👤 Artista / Canal',
        value: song.uploader?.name || 'Desconocido',
        inline: true,
      },
      {
        name: '⏱️ Duración',
        value: song.formattedDuration || '??:??',
        inline: true,
      },
      {
        name: '🔊 Volumen',
        value: `${queue.volume}%`,
        inline: true,
      },
      {
        name: '📋 En cola',
        value: `${queue.songs.length - 1} canción(es)`,
        inline: true,
      },
      {
        name: '🔁 Loop',
        value: loopMode,
        inline: true,
      },
      {
        name: '⏩ Siguiente',
        value: queue.songs[1] ? `[${queue.songs[1].name}](${queue.songs[1].url})` : 'Nada en cola',
        inline: true,
      },
      {
        name: '▶️ Progreso',
        value: progressBar,
        inline: false,
      }
    )
    .setFooter({
      text: `Pedido por ${member?.displayName ?? 'alguien'}`,
      iconURL: member?.user?.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  return embed;
}

/**
 * Barra de progreso visual
 */
function buildProgressBar(current, total, length = 20) {
  if (!total || total === 0) return '`──────────────────── ◉`';
  const pct = Math.min(current / total, 1);
  const pos = Math.round(pct * length);
  const bar = '─'.repeat(pos) + '◉' + '─'.repeat(length - pos);
  const currentFmt = formatSeconds(current);
  const totalFmt = formatSeconds(total);
  return `\`${currentFmt} ${bar} ${totalFmt}\``;
}

function formatSeconds(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

function getLoopLabel(mode) {
  switch (mode) {
    case 0: return '❌ Off';
    case 1: return '🔂 Canción';
    case 2: return '🔁 Cola';
    default: return '❌ Off';
  }
}

/**
 * Embed de error estilo compacto
 */
function createErrorEmbed(message) {
  return new EmbedBuilder()
    .setColor(0xFF3333)
    .setDescription(`❌  ${message}`);
}

/**
 * Embed de éxito / info
 */
function createInfoEmbed(message, color = 0x1DB954) {
  return new EmbedBuilder()
    .setColor(color)
    .setDescription(message);
}

/**
 * Embed de cola de reproducción
 */
function createQueueEmbed(queue) {
  const current = queue.songs[0];
  const upcoming = queue.songs.slice(1, 11); // máximo 10 mostradas

  const embed = new EmbedBuilder()
    .setColor(0x1DB954)
    .setAuthor({ name: '📋  Cola de Reproducción' })
    .setTitle(`🎵 Reproduciendo ahora: ${current.name}`)
    .setURL(current.url)
    .setThumbnail(current.thumbnail);

  if (upcoming.length > 0) {
    const list = upcoming
      .map((s, i) => `\`${i + 1}.\` [${s.name}](${s.url}) — \`${s.formattedDuration}\``)
      .join('\n');
    embed.addFields({ name: 'Próximas canciones', value: list });
  } else {
    embed.addFields({ name: 'Próximas canciones', value: '_No hay más canciones en cola._' });
  }

  const extra = queue.songs.length - 11;
  if (extra > 0) {
    embed.setFooter({ text: `... y ${extra} canción(es) más en cola` });
  }

  embed.addFields(
    { name: '🔁 Loop', value: getLoopLabel(queue.repeatMode), inline: true },
    { name: '🔊 Volumen', value: `${queue.volume}%`, inline: true },
    { name: '⏱️ Total', value: `${queue.songs.length} canciones`, inline: true }
  );

  return embed;
}

module.exports = { createNowPlayingEmbed, createErrorEmbed, createInfoEmbed, createQueueEmbed, buildProgressBar };