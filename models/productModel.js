const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  link: {
    type: String,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  id: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
  shops: [{ shopname: String, redirect: String, price: Number }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
