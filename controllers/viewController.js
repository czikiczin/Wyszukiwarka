const catchAsync = require('../utils/catchAsync');
const Product = require('./../models/productModel');

exports.getMainPage = (req, res) => {
  res.status(200).render('base', {
    title: 'Main Page',
  });
};
exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.find({ id: req.params.id });

  res.status(200).render('product', {
    title: 'Product',
    product,
  });
});
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  // const excludeFields = ['page', 'sort', 'limit', 'field'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log(JSON.parse(queryStr));

  let query = Product.find(JSON.parse(queryStr));

  if (req.query.sort) {
    query = query.sort(req.query.sort);
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 30;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // if (req.query.category !== '') {
  //   query = query.find({ category: req.query.category });
  // }
  if (req.query.title) {
    query = query.find({ title: new RegExp(req.query.title, 'i') });
  }
  if (req.query.page) {
    const numProducts = await Product.countDocuments();
    if (skip >= numProducts) throw new Error('This Page dont exist ');
  }
  const products = await query;
  const categories = await Product.distinct('category');
  console.log(categories);

  res.status(200).render('products', {
    title: 'Products',
    products,
    categories,
  });
});
