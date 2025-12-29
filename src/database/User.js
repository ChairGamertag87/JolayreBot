const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 }, // Economie
    xp: { type: Number, default: 0 },      // Niveaux
    level: { type: Number, default: 1 },
    lastDaily: { type: Date, default: null }, // Date dernier daily
    lastWork: { type: Date, default: null },  // Date dernier work
    warns: [ // Liste des avertissements
        {
            reason: String,
            date: { type: Date, default: Date.now },
            moderatorId: String
        }
    ]
});

module.exports = mongoose.model('User', userSchema);