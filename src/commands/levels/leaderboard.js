const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../database/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Voir le classement du serveur'),

    async execute(interaction) {
        // Recupere les 10 premiers tries par niveau puis XP
        const topUsers = await User.find({ guildId: interaction.guild.id })
            .sort({ level: -1, xp: -1 })
            .limit(10);

        if (topUsers.length === 0) {
            return interaction.reply('Personne n\'est classe pour le moment.');
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 Classement Serveur')
            .setColor('#FFD700');

        let description = '';
        for (let i = 0; i < topUsers.length; i++) {
            // Fetch pour avoir le pseudo a jour
            let memberName = 'Inconnu';
            try {
                const member = await interaction.guild.members.fetch(topUsers[i].userId);
                memberName = member.user.tag;
            } catch (e) {
                // Membre parti
            }

            description += `**${i + 1}.** ${memberName} - Niv ${topUsers[i].level} (${topUsers[i].xp} XP)\n`;
        }

        embed.setDescription(description);
        await interaction.reply({ embeds: [embed] });
    },
};