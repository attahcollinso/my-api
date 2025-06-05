const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
 name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true,
        unique: true
    },
    inStock: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('Product', ProductSchema);
