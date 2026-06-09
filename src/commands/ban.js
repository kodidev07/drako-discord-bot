const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("🔨 Banea a un usuario del servidor.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator, PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario que quieres banear.")
        .setRequired(true),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("usuario");
    const targetMember = interaction.guild.members.cache.get(target.id);

    // ── Comprobaciones previas ───────────────────────────────────────
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ Necesitas permisos de ``Administrador`` para usar este comando.",
        ephemeral: true,
      });
    }

    // ── Comprobar permisos del bot ───────────────────────────────────
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ No tengo permisos suficientes para banear usuarios.\n Asegúrate de que tengo el permiso de ``Administrador``.",
        ephemeral: true,
      });
    }
    // No puede banearse a sí mismo
    if (target.id === interaction.user.id) {
      return interaction.reply({
        content: "❌ No puedes banearte a ti mismo.",
        ephemeral: true,
      });
    }

    // No puede banear al propio bot
    if (target.id === interaction.client.user.id) {
      return interaction.reply({
        content: "No me puedes banear",
        ephemeral: true,
      });
    }

    // No puede banear a otros administradores
    if (targetMember?.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "> ❌ No puedo banear a otro ``Administrador``.",
        ephemeral: true,
      });
    }

    // Comprobar jerarquía de roles
    if (
      targetMember &&
      targetMember.roles.highest.position >=
        interaction.member.roles.highest.position
    ) {
      return interaction.reply({
        content: "> ❌ No puedes banear a ``alguien con un rol igual o superior al tuyo``.",
        ephemeral: true,
      });
    }

    // ── Guardar datos del target en el customId del modal ────────────
    // Se pasa el userId dentro del customId para recuperarlo al hacer submit
    const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } =
      require("discord.js");

    const modal = new ModalBuilder()
      .setCustomId(`ban_modal_${target.id}`)
      .setTitle(`🔨 Banear a ${target.tag}`);

    const reasonInput = new TextInputBuilder()
      .setCustomId("ban_reason")
      .setLabel("Razón del ban")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Escribe el motivo del ban...")
      .setRequired(true)
      .setMaxLength(500);

    const daysInput = new TextInputBuilder()
      .setCustomId("ban_days")
      .setLabel("Días de mensajes a eliminar (0–7)")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("0")
      .setRequired(false)
      .setMaxLength(1);

    modal.addComponents(
      new ActionRowBuilder().addComponents(reasonInput),
      new ActionRowBuilder().addComponents(daysInput),
    );

    await interaction.showModal(modal);
  },
};