const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Travailler pour gagner de l\'argent'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let user = await User.findOne({ userId, guildId });
        if (!user) user = new User({ userId, guildId });

        // Cooldown de 4h
        const now = new Date();
        const cooldown = 14400000; // 4h en ms
        if (user.lastWork && (now - user.lastWork) < cooldown) {
            const timeLeft = Math.ceil((cooldown - (now - user.lastWork)) / 60000); // Minutes restantes
            return interaction.reply({ content: `Tu dois attendre encore ${timeLeft} minutes avant de retravailler.`, ephemeral: true });
        }

        // Gain aleatoire entre 50 et 200
        const amount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;

        user.balance += amount;
        user.lastWork = now;
        await user.save();

        await interaction.reply(`Tu as travaille et gagne ${amount} coins. Nouveau solde : ${user.balance}.`);
    },
};