const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Borra una cantidad de mensajes.')
    .setContexts(InteractionContextType.Guild)
    .addIntegerOption(option =>
      option
        .setName('cantidad')
        .setDescription('Número de mensajes a borrar (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
  async execute(interaction) {
    const cantidad = interaction.options.getInteger('cantidad');

    // Comprobar que el bot tiene permisos
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ No tengo permisos de ``Administrador``.',
        ephemeral: true,
      });
    }

    try {
      await interaction.channel.bulkDelete(cantidad, true);

      await interaction.reply({
        content: `✅ Se borraron ${cantidad} mensajes.`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: '❌ No se pudieron borrar los mensajes.',
        ephemeral: true,
      });
    }
  },
};