const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Shop = require('../../database/Shop');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('additem')
        .setDescription('Ajouter un role a la boutique')
        .addRoleOption(option =>
            option.setName('role').setDescription('Le role a vendre').setRequired(true))
        .addIntegerOption(option =>
            option.setName('price').setDescription('Prix du role').setRequired(true))
        .addStringOption(option =>
            option.setName('description').setDescription('Description de l\'article'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const price = interaction.options.getInteger('price');
        const description = interaction.options.getString('description') || 'Pas de description';

        // Evite les doublons
        const existingItem = await Shop.findOne({ guildId: interaction.guild.id, roleId: role.id });
        if (existingItem) {
            return interaction.reply({ content: 'Ce role est deja en vente.', ephemeral: true });
        }

        const newItem = new Shop({
            guildId: interaction.guild.id,
            roleId: role.id,
            price: price,
            description: description
        });

        await newItem.save();
        await interaction.reply(`Article ajoute : ${role.name} pour ${price} coins.`);
    },
};