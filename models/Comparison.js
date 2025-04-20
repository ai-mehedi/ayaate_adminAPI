const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    focus_keyword: {
        type: String,
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
    specification: [
        {
            name: { type: String, trim: true },
            value1: { type: String, trim: true },
            value2: { type: String, trim: true }
        }
    ],
    product1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    product2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    thumbnail: {
        type: String,
        trim: true
    },
    keyword: {
        type: String,
        trim: true
    },
    type: { type: String, enum: ['article', 'comparison', 'review'], default: 'article' },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },

}, {
    timestamps: true
});

module.exports = mongoose.model('Comparison', comparisonSchema);
