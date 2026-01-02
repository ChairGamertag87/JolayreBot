const { Events } = require('discord.js');
const User = require('../../database/User');

// Map pour stocker l'heure d'arrivee
const voiceJoinTimes = new Map();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const userId = newState.member.id;
        const guildId = newState.guild.id;

        // Utilisateur rejoint un salon (n'etait pas la avant)
        if (!oldState.channelId && newState.channelId) {
            voiceJoinTimes.set(userId, Date.now());
        }

        // Utilisateur quitte un salon
        else if (oldState.channelId && !newState.channelId) {
            const joinTime = voiceJoinTimes.get(userId);
            if (!joinTime) return;

            const duration = Date.now() - joinTime;
            const minutes = Math.floor(duration / 60000);

            // Gain: 10 XP par minute
            if (minutes > 0) {
                const xpGained = minutes * 10;

                let user = await User.findOne({ userId, guildId });
                if (!user) user = new User({ userId, guildId });

                user.xp += xpGained;

                // Verif Level Up rapide
                const xpNeeded = user.level * user.level * 100;
                if (user.xp >= xpNeeded) {
                    user.level++;
                    user.xp -= xpNeeded;
                }

                await user.save();
            }

            voiceJoinTimes.delete(userId);
        }
    },
};