const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Shop = require('../../database/Shop');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Voir la boutique du serveur'),

    async execute(interaction) {
        const items = await Shop.find({ guildId: interaction.guild.id });

        if (items.length === 0) {
            return interaction.reply('La boutique est vide pour le moment.');
        }

        const embed = new EmbedBuilder()
            .setTitle('Boutique du Serveur')
            .setColor('#0099ff')
            .setDescription('Utilise /buy [nom du role] pour acheter.');

        items.forEach(item => {
            const role = interaction.guild.roles.cache.get(item.roleId);
            const roleName = role ? role.name : 'Role inconnu';
            embed.addFields({
                name: `${roleName} - ${item.price} coins`,
                value: item.description
            });
        });

        await interaction.reply({ embeds: [embed] });
    },
};