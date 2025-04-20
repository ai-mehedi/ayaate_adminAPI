const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
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
    focus_keyword: {
        type: String,
        trim: true
    },
    keyword: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    thumbnail: {
        type: String,
        trim: true
    },
    pros: [
        {
            type: String,
            trim: true
        }
    ],
    cons: [
        {
            type: String,
            trim: true
        }
    ],
    specification: [
        {
            name: { type: String, trim: true },
            value: { type: String, trim: true }
        }
    ],
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
    rating: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    why_we_pick: {
        type: String,
        trim: true
    },
    who_it_works_for: {
        type: String,
        trim: true
    },
    bottomline: {
        type: String,
        trim: true
    },
    digitalsoftware: {
        image: { type: String, trim: true },
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        affiliate_url: { type: String, trim: true },
        subscription: { type: String, trim: true }
    },
    type: { type: String, enum: ['article', 'comparison', 'review'], default: 'article' },

    product: [
        {
            Image: { type: String, trim: true },
            title: { type: String, trim: true },
            description: { type: String, trim: true },
            affiliate_url: { type: String, trim: true },
            price: { type: String, trim: true },
            ofprice: { type: String, trim: true },
            store: { type: String, trim: true }
        }
    ],
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },

}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
