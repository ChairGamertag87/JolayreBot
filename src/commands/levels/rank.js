const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Voir son niveau et son XP')
        .addUserOption(option =>
            option.setName('target').setDescription('Membre a voir')),

    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const user = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

        if (!user) {
            return interaction.reply('Ce membre n\'a pas encore d\'XP.');
        }

        const xpNeeded = user.level * user.level * 100;

        await interaction.reply({
            content: `📊 **Niveau de ${target.tag}**\nNiveau : ${user.level}\nXP : ${user.xp} / ${xpNeeded}`
        });
    },
};