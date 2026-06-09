const { createErrorEmbed } = require('./embeds');

/**
 * Verifica que el usuario esté en un canal de voz y que el bot pueda unirse.
 * Devuelve { valid: false } y responde al interaction si hay un problema.
 */
async function validateVoiceState(interaction) {
  const member = interaction.member;
  const voiceChannel = member?.voice?.channel;

  if (!voiceChannel) {
    await interaction.reply({
      embeds: [createErrorEmbed('Debes estar en un canal de voz para usar este comando.')],
      ephemeral: true,
    });
    return { valid: false };
  }

  const permissions = voiceChannel.permissionsFor(interaction.client.user);
  if (!permissions.has('Connect') || !permissions.has('Speak')) {
    await interaction.reply({
      embeds: [createErrorEmbed('No tengo permisos para unirme o hablar en tu canal de voz.')],
      ephemeral: true,
    });
    return { valid: false };
  }

  return { valid: true, voiceChannel };
}

/**
 * Verifica que haya una cola activa en este servidor.
 */
async function validateQueue(interaction) {
  const queue = interaction.client.getQueue(interaction.guild);
  if (!queue) {
    await interaction.reply({
      embeds: [createErrorEmbed('No hay música reproduciéndose en este momento.')],
      ephemeral: true,
    });
    return { valid: false };
  }
  return { valid: true, queue };
}

module.exports = { validateVoiceState, validateQueue };