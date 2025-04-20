const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  focuskeyword: { type: String, trim: true },
  keyword: { type: String, trim: true },
  description: { type: String, trim: true },
  content: { type: String },
  thumbnail: { type: String, trim: true },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },

  type: { type: String, enum: ['article', 'comparison', 'review'], default: 'article' },

  digitalsoftware: {
    image: { type: String, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    affiliate_url: { type: String, trim: true },
    subscription: { type: String, trim: true }
  },

  product: [
    {
      image: { type: String, trim: true },
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      affiliate_url: { type: String, trim: true },
      price: { type: String, trim: true },
      ofprice: { type: String, trim: true },
      store: { type: String, trim: true }
    }
  ],

  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],

}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
