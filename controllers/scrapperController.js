const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('./../models/productModel');

exports.scrapeData = async () => {
  try {
    let urlString = 'https://www.ceneo.pl';

    const data1 = await axios.get('https://www.ceneo.pl');
    const $1 = cheerio.load(data1.data);
    const categories = [];
    const products = [];

    const listCategories = $1('.cat-menu-item__link ');

    for (el of listCategories) {
      const category = $1(el).attr('href');
      if (category !== 'https://www.ceneo.pl/#') categories.push(category);
    }
    console.log(categories);

    for (const elem of categories) {
      let productUrl = urlString.concat(elem);
      let data2 = await axios.get(productUrl);

      let $ = cheerio.load(data2.data);

      let listItems = $('.cat-prod-row ');
      console.log(listItems.length);

      if (listItems.length == 0) {
        data2 = await axios.get(productUrl.concat(';0191.htm'));

        $ = cheerio.load(data2.data);
        listItems = $('.cat-prod-row ');
      }

      //console.log(data2.data);
      for (const el of listItems) {
        const product = {
          link: '',
          title: '',
          id: '',
          category: '',
          price: '',
          image: '',
          shops: [],
        };
        product.link = $(el).find('div div a').attr('href');
        product.title = $(el).find('div div a').attr('title');

        product.id = $(el).attr('data-pid');
        product.category = elem;
        product.price = Number($(el).attr('data-productminprice'));

        product.image = $(el).find('div div a img').attr('data-original');

        const redirectUrl = urlString.concat(product.link);
        const data3 = await axios.get(redirectUrl);
        const $3 = cheerio.load(data3.data);

        const shopList = $3('.product-offers__list__item');

        for (element of shopList) {
          const shop = {
            shopname: '',
            redirect: '',
            price: '',
          };
          shop.shopname = $(element).find('div div').attr('data-shopurl');
          shop.redirect = $(element).find('div div').attr('data-click-url');
          shop.price = $(element).find('div div').attr('data-price');
          product.shops.push(shop);
        }
        if (
          (product.image != null) &
          (product.title != null) &
          (product.price != null) &
          (product.category != null) &
          (product.id != null) &
          (product.link != null)
        ) {
          products.push(product);
        }
      }
      await Product.deleteMany();
      await Product.create(products);

      console.log(products);
    }
  } catch (err) {
    console.log(err);
  }
};
