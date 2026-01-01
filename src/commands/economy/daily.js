const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Recuperer sa recompense quotidienne (500 coins)'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        // Cherche ou cree l'utilisateur
        let user = await User.findOne({ userId, guildId });
        if (!user) {
            user = new User({ userId, guildId });
        }

        // Verification du cooldown (24h)
        const now = new Date();
        if (user.lastDaily && (now - user.lastDaily) < 86400000) { // 86400000 ms = 24h
            return interaction.reply({ content: 'Tu as deja recupere ton daily aujourd\'hui. Reviens demain !', ephemeral: true });
        }

        // Ajout de l'argent
        user.balance += 500;
        user.lastDaily = now;
        await user.save();

        await interaction.reply(`Tu as recu 500 coins ! Solde actuel : ${user.balance} coins.`);
    },
};