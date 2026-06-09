const {SlashCommandBuilder,EmbedBuilder, InteractionContextType,} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓 Muestra tu latencia.")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel),
    async execute(interaction) {

        const sent = await interaction.reply({
            content: "Calculando latencia...",
            fetchReply: true,
            ephemeral: true
        });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiPing = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setAuthor({name: "Pong!", iconURL: "https://cdn.discordapp.com/avatars/1513184448177373244/a7fb97aa659769777090448f5efb114b.png?size=4096&ignore=true)"})
            .setColor(16777215)
            .addFields(
                {
                    name: "📡 Latencia del Bot",
                    value: `\`${latency} ms\``,
                    inline: true
                },
                {
                    name: "🌐 Latencia de la API",
                    value: `\`${apiPing} ms\``,
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.editReply({
            content: "",
            embeds: [embed],
            ephemeral: true
        });
    }
};