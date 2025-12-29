const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    logChannelId: { type: String, default: null }, // Salon logs general
    welcomeChannelId: { type: String, default: null }, // Salon bienvenue
    ignoreXpChannels: { type: [String], default: [] } // Salons sans gain XP
});

module.exports = mongoose.model('Guild', guildSchema);