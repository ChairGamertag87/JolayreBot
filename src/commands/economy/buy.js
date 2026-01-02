const { SlashCommandBuilder } = require('discord.js');
const Shop = require('../../database/Shop');
const User = require('../../database/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Acheter un role de la boutique')
        .addRoleOption(option =>
            option.setName('role').setDescription('Le role a acheter').setRequired(true)),

    async execute(interaction) {
        const roleTarget = interaction.options.getRole('role');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        // Verif si l'item existe
        const item = await Shop.findOne({ guildId, roleId: roleTarget.id });
        if (!item) {
            return interaction.reply({ content: 'Cet objet n\'est pas en vente.', ephemeral: true });
        }

        // Verif si l'utilisateur a deja le role
        if (interaction.member.roles.cache.has(roleTarget.id)) {
            return interaction.reply({ content: 'Tu as deja ce role.', ephemeral: true });
        }

        // Verif argent
        const user = await User.findOne({ userId, guildId });
        if (!user || user.balance < item.price) {
            return interaction.reply({ content: `Tu n'as pas assez d'argent. Il te faut ${item.price} coins.`, ephemeral: true });
        }

        // Transaction
        user.balance -= item.price;
        await user.save();

        await interaction.member.roles.add(roleTarget);

        await interaction.reply(`Achat reussi ! Tu as recu le role **${roleTarget.name}** pour ${item.price} coins.`);
    },
};