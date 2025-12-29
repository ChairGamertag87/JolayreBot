const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulser un membre')
        .addUserOption(option =>
            option.setName('target').setDescription('Membre a expulser').setRequired(true))
        .addStringOption(option =>
            option.setName('reason').setDescription('Raison de l\'expulsion'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Aucune raison';
        const member = await interaction.guild.members.fetch(target.id);

        if (!member.kickable) {
            return interaction.reply({ content: 'Je ne peux pas expulser ce membre.', ephemeral: true });
        }

        await member.kick(reason);
        await interaction.reply(`Membre ${target.tag} expulse. Raison : ${reason}`);
    },
};