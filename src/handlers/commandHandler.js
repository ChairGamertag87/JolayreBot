const fs = require('fs');
const { REST, Routes } = require('discord.js');
const config = require('../../config.json');

module.exports = (client) => {
    const commandsArr = [];
    const commandFolders = fs.readdirSync('./src/commands');

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);

            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                commandsArr.push(command.data.toJSON());
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    (async () => {
        try {
            console.log('Refresh commandes...');

            if (config.guildId) {
                // Serveur test
                await rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: commandsArr },
                );
                console.log('Commandes serv enregistrees');
            } else {
                // Global
                await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: commandsArr },
                );
                console.log('Commandes global enregistrees');
            }
        } catch (error) {
            console.error(error);
        }
    })();
}