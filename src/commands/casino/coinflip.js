const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Parier sur Pile ou Face')
        .addStringOption(option =>
            option.setName('choice').setDescription('Pile ou Face').setRequired(true)
                .addChoices({ name: 'Pile', value: 'pile' }, { name: 'Face', value: 'face' }))
        .addIntegerOption(option =>
            option.setName('amount').setDescription('Mise').setRequired(true)),

    async execute(interaction) {
        const choice = interaction.options.getString('choice');
        const amount = interaction.options.getInteger('amount');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        if (amount < 1) return interaction.reply({ content: 'Mise invalide.', ephemeral: true });

        const user = await User.findOne({ userId, guildId });
        if (!user || user.balance < amount) {
            return interaction.reply({ content: 'Pas assez d\'argent.', ephemeral: true });
        }

        // Tirage aleatoire (0 ou 1)
        const result = Math.random() < 0.5 ? 'pile' : 'face';
        const win = result === choice;

        if (win) {
            user.balance += amount;
            await interaction.reply(`Resultat : **${result}**. Tu gagnes ${amount} coins ! (Solde: ${user.balance})`);
        } else {
            user.balance -= amount;
            await interaction.reply(`Resultat : **${result}**. Tu as perdu ${amount} coins. (Solde: ${user.balance})`);
        }
        await user.save();
    },
};