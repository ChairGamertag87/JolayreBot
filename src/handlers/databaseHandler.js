const mongoose = require('mongoose');

module.exports = (client) => {
    if (!process.env.MONGO_URI) return;

    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('DB connectee'))
        .catch((err) => console.error('Erreur DB', err));
};