const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Detiene la música y desconecta el bot."),

    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: "❌ No hay ninguna canción reproduciéndose.", ephemeral: true });
        }

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: "❌ Debes estar en un canal de voz.", ephemeral: true });
        }
        const current = queue.currentTrack;
        queue.delete();
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `⏹️ Música detenida por ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setColor(16777215)
        // Detiene la reproducción y destruye la cola

        await interaction.reply({
            embeds: [embed]
        });
    },
};