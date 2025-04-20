const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstname: { type: String },
        lastname: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // Only for manual auth

        // Social Auth IDs
        googleId: { type: String },
        facebookId: { type: String },

        profilePic: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },

        // Optional extra fields
        title: { type: String },
        description: { type: String },
        social: {
            facebook: { type: String },
            x: { type: String },
            linkedin: { type: String },
            instagram: { type: String },
        },
        phone: { type: String },
        country: { type: String },
        address: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
