const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleId: { type: String, required: true }, // ID du role a vendre
    price: { type: Number, required: true },
    description: { type: String, default: 'Pas de description' }
});

module.exports = mongoose.model('Shop', shopSchema);