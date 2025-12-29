const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute temporaire (Timeout)')
        .addUserOption(option =>
            option.setName('target').setDescription('Membre a mute').setRequired(true))
        .addStringOption(option =>
            option.setName('duration').setDescription('Duree (ex: 10m, 1h, 1d)').setRequired(true))
        .addStringOption(option =>
            option.setName('reason').setDescription('Raison'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') ?? 'Aucune raison';
        const msDuration = ms(duration);

        if (!msDuration) {
            return interaction.reply({ content: 'Duree invalide.', ephemeral: true });
        }

        if (!target.moderatable) {
            return interaction.reply({ content: 'Je ne peux pas mute ce membre.', ephemeral: true });
        }

        await target.timeout(msDuration, reason);
        await interaction.reply(`${target.user.tag} mute pour ${duration}. Raison : ${reason}`);
    },
};