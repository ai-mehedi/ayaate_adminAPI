const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    metaKeyword: {
        type: String,
        trim: true
    },
    navigation: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);