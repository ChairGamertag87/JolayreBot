const { Events } = require('discord.js');
const User = require('../../database/User');
const Guild = require('../../database/Guild');

const cooldowns = new Set(); // Evite le spam

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        // Verif si salon ignore
        const guildConfig = await Guild.findOne({ guildId: message.guild.id });
        if (guildConfig && guildConfig.ignoreXpChannels.includes(message.channel.id)) return;

        // Cooldown 60s
        const key = `${message.guild.id}-${message.author.id}`;
        if (cooldowns.has(key)) return;

        // Calcul XP (Random entre 15 et 25)
        const xpAmount = Math.floor(Math.random() * 11) + 15;

        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) user = new User({ userId: message.author.id, guildId: message.guild.id });

        user.xp += xpAmount;

        // Level Up: XP necessaire = Level * Level * 100
        const xpNeeded = user.level * user.level * 100;
        if (user.xp >= xpNeeded) {
            user.level++;
            user.xp -= xpNeeded; // Reset XP ou garder cumulatif (ici on garde le surplus)
            message.channel.send(`Bravo ${message.author}, tu passes niveau **${user.level}** !`);
        }

        await user.save();

        // Active cooldown
        cooldowns.add(key);
        setTimeout(() => cooldowns.delete(key), 60000);
    },
};