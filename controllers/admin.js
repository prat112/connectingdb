const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  //create- its  creates a new element based on the model and saves it in the database
  //build - build creates a new element in javascript and we have to save it manually
  //sequelize works with promises

  //since req.user is a sequelize object so...
  //createProduct because of association and because of that 
  //we dont have to add usrId explicitly
  req.user.createProduct({
    title:title,
    price:price,
    imageUrl:imageUrl,
    description:description
  }).then(() => {
    console.log('product created');
    res.redirect('/admin/products');
  })
  .catch(err=> console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  //products connected to a partidcular user
  req.user.getProducts({where: { id : prodId}})
  //will return a product array
  //Product.findByPk(prodId)
  .then(product => {
    if (!product) return res.redirect('/');
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product[0]
    });
  }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
  .then((product)=>{
    product.title = updatedTitle,
    product.price= updatedPrice,
    product.description = updatedDesc,
    product.imageUrl = updatedImageUrl
    //the changes to product till is now is local and save method
    //will make the changes in the database
    return product.save();
  })
  //the below then is handling the promise object from the return 
  // product.save statement and errors from both the promises 
  //will be handled by the catch statement below
  .then(result => {
    console.log('updated product');
    res.redirect('/admin/products');
})
  //changes will be only visible after refrshing because
  //the below code is synchronous and promises are aysnchrnous
  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  //getting all products for a particular user
  req.user
  .getProducts()
  //Product.findAll().
  .then((products =>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })).catch(err => console.log(err));
    
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //Product.destroy({});giving a wher condition
  Product.findByPk(prodId)
  .then(product =>{
    return product.destroy();
  })
  .then(result =>{
    console.log('deleted product');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err))
  
};