const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    website_name: {
        type: String,
        required: true
    },
    email_or_username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Vault', vaultSchema);