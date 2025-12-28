const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Prêt ! Connecté en tant que ${client.user.tag}`); // Log connexion

        client.user.setActivity('https://habibiserver.dev', { type: ActivityType.Watching }); // Statut bot
    },
};