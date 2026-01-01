const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../../database/User'); // Import du modele DB

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Donner un avertissement')
        .addUserOption(option =>
            option.setName('target').setDescription('Membre a avertir').setRequired(true))
        .addStringOption(option =>
            option.setName('reason').setDescription('Raison').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        // Recherche ou creation du profil utilisateur dans la DB
        let userProfile = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

        if (!userProfile) {
            userProfile = new User({
                userId: target.id,
                guildId: interaction.guild.id
            });
        }

        // Ajout du warn
        const newWarn = {
            reason: reason,
            moderatorId: interaction.user.id,
            date: new Date()
        };

        userProfile.warns.push(newWarn);
        await userProfile.save(); // Sauvegarde dans MongoDB

        await interaction.reply({
            content: `Avertissement donne a ${target.tag}.\nRaison: ${reason}\nIl a maintenant ${userProfile.warns.length} avertissement(s).`
        });
    },
};