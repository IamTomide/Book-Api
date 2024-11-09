const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Name is a required field'],
        unique: true
    },
    author: {
        type: String,
        required: [true, 'Author is a required field']
    },
    description: String,
    price: {
        type: Number,
        get: v => (v/100).toFixed(2),
        set: v => v*100,
        required: [true, 'Name is a required field']
    }
}, {timestamps: true, toJSON: {getters: true}});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;