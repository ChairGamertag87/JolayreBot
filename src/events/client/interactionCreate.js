const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate, // Type event
    once: false,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return; // Stop si pas commande

        const command = client.commands.get(interaction.commandName); // Trouve commande

        if (!command) return; // Commande inconnue

        try {
            await command.execute(interaction); // Lance commande
        } catch (error) {
            console.error(error); // Log erreur
            // Réponse erreur
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Erreur commande !', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Erreur commande !', ephemeral: true });
            }
        }
    },
};