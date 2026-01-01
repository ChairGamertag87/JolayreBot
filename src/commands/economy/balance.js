const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Voir son solde ou celui d\'un autre membre')
        .addUserOption(option =>
            option.setName('target').setDescription('Membre a verifier')),

    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const userId = target.id;
        const guildId = interaction.guild.id;

        const user = await User.findOne({ userId, guildId });
        const balance = user ? user.balance : 0;

        await interaction.reply(`${target.tag} possede ${balance} coins.`);
    },
};