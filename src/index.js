require('dotenv').config();
const {Client, GatewayIntentBits, Collection, Routes, REST} = require('discord.js');
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]});

client.commands = new Collection();

require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);
require("./handlers/musicHandler")(client);

(async () => {
    try {
        const commands = [];
        const commandsPath = path.join(__dirname, "commands");
        if (!fs.existsSync(commandsPath)) {
            throw new Error("La carpeta 'commands' no existe.");
        }
        
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (!command.data) {
                console.warn(`⚠️ ${file} no contiene 'data'.`);
                continue;
            }
            commands.push(command.data.toJSON());
        }
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body: commands,
            }
        );
        console.log(`📦 Han sido registrados: ${commands.length} comandos`);

    } catch (error) {
        console.error("❌ Error al registrar comandos");
        console.error(error);
    }
})();

client.login(process.env.TOKEN);