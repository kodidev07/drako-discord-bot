const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} conectado.`);
        client.user.setPresence({
            status: "idle",
            activities: [
                {
                    name: "En Mantenimiento...",
                    type: ActivityType.Custom
                }
            ]

        });
    }
};