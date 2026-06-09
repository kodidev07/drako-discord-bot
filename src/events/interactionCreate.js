const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // ── Select Menu ──────────────────────────────────────────────────
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === "menu") {
                if (interaction.values[0] === "info") {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: "Comandos de información",
                            iconURL:
                                "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
                        })
                        .addFields({
                            name: "Lista de comandos",
                            value: "> ``/help, /ping``",
                        })
                        .setColor(16777215)
                        .setFooter({
                            text: "Made by kodidev",
                            iconURL:
                                "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
                        });
                    const menu = new StringSelectMenuBuilder()
                        .setCustomId("menu")
                        .setPlaceholder("Selecciona una categoria")
                        .addOptions({
                            label: "Comandos de información",
                            description: "/ping, /help, /avatar",
                            value: "info",
                            emoji: "ℹ️",
                        },
                            {
                                label: "Menú principal",
                                value: "principal"
                            }
                        );
                    const selectRow = new ActionRowBuilder().addComponents(menu);
                    const urlButton = new ButtonBuilder()
                        .setLabel("Servidor de Soporte")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.gg/zfR7NAhbAv");
                    const bugButton = new ButtonBuilder()
                        .setCustomId("bug_report")
                        .setLabel("Reportar Bug")
                        .setStyle(ButtonStyle.Danger);

                    const buttonRow = new ActionRowBuilder().addComponents(urlButton, bugButton);

                    await interaction.update({ embeds: [embed], components: [selectRow, buttonRow] });
                }

                if (interaction.values[0] === "principal") {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: "Drako",
                            iconURL:
                                "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
                        })
                        .setDescription(
                            "Bienvenido al panel de ayuda, te permite ver los comandos disponibles de <@1513184448177373244>.",
                        )
                        .addFields({
                            name: "Comandos",
                            value:
                                "> ``Puedes ver los comandos disponibles usando el menú de abajo``",
                        })
                        .setColor(16777215)
                        .setFooter({
                            text: "Made by kodidev",
                            iconURL:
                                "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096",
                        });
                    const menu = new StringSelectMenuBuilder()
                        .setCustomId("menu")
                        .setPlaceholder("Selecciona una categoria")
                        .addOptions({
                            label: "Comandos de información",
                            description: "/ping, /help",
                            value: "info",
                            emoji: "ℹ️",
                        },
                            {
                                label: "Menú principal",
                                value: "principal"
                            }
                        );
                    const selectRow = new ActionRowBuilder().addComponents(menu);
                    const urlButton = new ButtonBuilder()
                        .setLabel("Servidor de Soporte")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.gg/zfR7NAhbAv");
                    const bugButton = new ButtonBuilder()
                        .setCustomId("bug_report")
                        .setLabel("Reportar Bug")
                        .setStyle(ButtonStyle.Danger);

                    const buttonRow = new ActionRowBuilder().addComponents(urlButton, bugButton);

                    await interaction.update({ embeds: [embed], components: [selectRow, buttonRow] });
                }
            }
            return;
        }

        // ── Botón Bug Report → abre el modal ────────────────────────────
        if (interaction.isButton()) {
            if (interaction.customId === "bug_report") {
                const modal = new ModalBuilder()
                    .setCustomId("bug_report_modal")
                    .setTitle("Reportar un Bug");

                const titleInput = new TextInputBuilder()
                    .setCustomId("bug_title")
                    .setLabel("Título del bug")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Ej: El comando /ping no responde")
                    .setRequired(true)
                    .setMaxLength(100);

                const descInput = new TextInputBuilder()
                    .setCustomId("bug_description")
                    .setLabel("Descripción")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Describe el bug con el mayor detalle posible...")
                    .setRequired(true)
                    .setMaxLength(1000);

                const stepsInput = new TextInputBuilder()
                    .setCustomId("bug_steps")
                    .setLabel("Pasos para reproducirlo")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("1. Usa el comando...\n2. Haz click en...\n3. El error aparece...")
                    .setRequired(false)
                    .setMaxLength(500);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(titleInput),
                    new ActionRowBuilder().addComponents(descInput),
                    new ActionRowBuilder().addComponents(stepsInput),
                );

                await interaction.showModal(modal);
            }
            return;
        }

        // ── Modal Submit Bug Report ──────────────────────────────────────
        if (interaction.isModalSubmit()) {
            if (interaction.customId === "bug_report_modal") {
                const title = interaction.fields.getTextInputValue("bug_title");
                const description = interaction.fields.getTextInputValue("bug_description");
                const steps = interaction.fields.getTextInputValue("bug_steps") || "No especificado";

                const reportEmbed = new EmbedBuilder()
                    .setTitle("Nuevo Bug Reportado")
                    .addFields(
                        { name: "📌 Título", value: title },
                        { name: "📝 Descripción", value: description },
                        { name: "🔁 Pasos para reproducirlo", value: steps },
                        {
                            name: "👤 Reportado por",
                            value: `${interaction.user.tag} (${interaction.user.id})`,
                        },
                        {
                            name: "🌐 Servidor",
                            value: interaction.guild
                                ? `${interaction.guild.name} (${interaction.guild.id})`
                                : "DM / Canal privado",
                        },
                    )
                    .setColor(0xff0000)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({ text: "Bug Report System", iconURL: "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096" });

                try {
                    // Enviar el reporte por MD al developer
                    const developer = await client.users.fetch(process.env.DEVELOPER_ID);
                    await developer.send({ embeds: [reportEmbed] });

                    await interaction.reply({
                        content: "✅ ¡Gracias! Tu reporte ha sido enviado correctamente.",
                        ephemeral: true,
                    });
                } catch (err) {
                    console.error("❌ No se pudo enviar el reporte al developer:", err);
                    await interaction.reply({
                        content: "❌ Hubo un error al enviar el reporte. Inténtalo más tarde.",
                        ephemeral: true,
                    });
                }
            }
            if (interaction.customId.startsWith("ban_modal_")) {
                const targetId = interaction.customId.replace("ban_modal_", "");
                const reason = interaction.fields.getTextInputValue("ban_reason");
                const daysRaw = interaction.fields.getTextInputValue("ban_days");
                const days = Math.min(7, Math.max(0, parseInt(daysRaw) || 0));

                try {
                    const target = await interaction.client.users.fetch(targetId);

                    // Intentar notificar al usuario por MD antes de banear
                    try {
                        await target.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Has sido baneado")
                                    .addFields(
                                        { name: "🌐 Servidor", value: interaction.guild.name },
                                        { name: "📋 Razón", value: reason },
                                        { name: "👮 Moderador", value: interaction.user.tag },
                                    )
                                    .setColor(0xff0000)
                                    .setTimestamp(),
                            ],
                        });
                    } catch {
                        // El usuario tiene los MD cerrados, se ignora y se banea igualmente
                    }

                    // Ejecutar el ban
                    await interaction.guild.members.ban(targetId, {
                        deleteMessageDays: days,
                        reason: `${reason} | Moderador: ${interaction.user.tag}`,
                    });

                    // Confirmación al moderador
                    const successEmbed = new EmbedBuilder()
                        .setTitle("Usuario baneado")
                        .setThumbnail(target.displayAvatarURL())
                        .addFields(
                            { name: "👤 Usuario", value: `\`${target.tag} (${target.id})\`` },
                            { name: "📋 Razón", value: `\`${reason}\`` },
                            { name: "🗑️ Mensajes eliminados", value: `\`${days} día(s)\`` },
                            { name: "👮 Moderador", value: `\`${interaction.user.tag}\`` },
                        )
                        .setColor(0xff0000)
                        .setTimestamp()

                    await interaction.reply({ embeds: [successEmbed], ephemeral: true });

                } catch (err) {
                    console.error("❌ Error al banear:", err);
                    await interaction.reply({
                        content: "❌ No se pudo ejecutar el ban. Comprueba los permisos del bot.",
                        ephemeral: true,
                    });
                }
            }
            return;
        }
        // ── Slash Commands ───────────────────────────────────────────────
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true,
            });
        }
    },
};