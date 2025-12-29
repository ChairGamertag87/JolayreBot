const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un membre')
        .addUserOption(option =>
            option.setName('target').setDescription('Membre a bannir').setRequired(true))
        .addStringOption(option =>
            option.setName('reason').setDescription('Raison du ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Perms Admin

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Aucune raison';
        const member = await interaction.guild.members.fetch(target.id);

        if (!member.bannable) {
            return interaction.reply({ content: 'Je ne peux pas bannir ce membre.', ephemeral: true });
        }

        await member.ban({ reason: reason });
        await interaction.reply(`Membre ${target.tag} banni. Raison : ${reason}`);
    },
};