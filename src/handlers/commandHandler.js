const fs = require("fs");
const path = require("path");

module.exports = (client) => {

    const commandsPath = path.join(__dirname, "..", "commands");

    const files = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {

        const command = require(path.join(commandsPath, file));

        client.commands.set(command.data.name, command);
    }

    console.log(`[COMMANDS] ${files.length} comandos cargados.`);
};