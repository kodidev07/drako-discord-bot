const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("🔓 Desbanea a un usuario del servidor.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("La ID del usuario que quieres desbanear.")
        .setRequired(true),
    ),

  async execute(interaction) {

    // ── Comprobar permisos del ejecutor ──────────────────────────────
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "> ❌ Necesitas permisos de ``Administrador`` para usar este comando.",
        ephemeral: true,
      });
    }

    // ── Comprobar permisos del bot ───────────────────────────────────
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: "❌ No tengo permisos suficientes para desbanear usuarios.\n Asegúrate de que tengo el permiso de ``Administrador``.",
        ephemeral: true,
      });
    }

    const userId = interaction.options.getString("userid");

    // ── Comprobar que la ID tiene formato válido ─────────────────────
    if (!/^\d{17,19}$/.test(userId)) {
      return interaction.reply({
        content: "❌ ``La ID proporcionada no es válida``.\n Debes poner tu cuenta en ``configuracion usuario > developer mode activado``.",
        ephemeral: true,
      });
    }

    // ── Comprobar que el usuario está baneado ────────────────────────
    const banList = await interaction.guild.bans.fetch();
    const bannedUser = banList.get(userId);

    if (!bannedUser) {
      return interaction.reply({
        content: "❌ ``Ese usuario no está baneado en el servidor.``",
        ephemeral: true,
      });
    }

    // ── Ejecutar el unban ────────────────────────────────────────────
    try {
      await interaction.guild.members.unban(userId, `Desbaneado por ${interaction.user.tag}`);

      const embed = new EmbedBuilder()
        .setTitle("Usuario desbaneado")
        .setThumbnail(bannedUser.user.displayAvatarURL())
        .addFields(
          { name: "👤 Usuario", value: `\`${bannedUser.user.tag} (${bannedUser.user.id})\`` },
          { name: "📋 Razón del ban original", value: `\`${bannedUser.reason}\`` ?? "\`Sin razón especificada\`" },
          { name: "👮 Desbaneado por", value: `\`${interaction.user.tag}\`` },
        )
        .setColor(0x00ff99)
        .setTimestamp()

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (err) {
      console.error("❌ Error al desbanear:", err);
      await interaction.reply({
        content: "❌ No se pudo ejecutar el unban. Comprueba los permisos del bot.",
        ephemeral: true,
      });
    }
  },
};