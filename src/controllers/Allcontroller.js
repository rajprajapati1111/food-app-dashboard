const Product = require('../models/Product');
const admin = require('../models/Admin') 
const path = require('path');
const fs = require('fs');

// Home Page
module.exports.getHome = async (req, res) => {
  try {
    res.render('home');
  } catch (error) {
    console.log(error);
  }
};


// login page 

module.exports.login = async (req,res) => {
  try {
    
    res.render('login')

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!!" });
  }
}

// login data controller
module.exports.logindata = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await admin.findOne({ email: email });

    console.log("Login attempt:", req.body);
    console.log("User found:", user);

    

    if (!user) {
      return res.render('login', { error: 'Email not found!' });
    }
    if (user.password !== password) {
      return res.render('login', { error: 'Incorrect password!' });
    }

    console.log('Login success:', user.email);
    return res.redirect('/Dashboard');                  

  } catch (err) {
    console.log('Login error:', err);
    res.status(500).send('Internal server error');
  }
};


// Add Product
module.exports.addproduct = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.file);

    if (req.file) {
      data.image = '/uploads/' + req.file.filename;
    } else {
      console.log("Image is not uploaded!!");
    }

    await Product.create(data); 
    res.redirect('/products');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!!" });
  }
};

// Get Edit Form
module.exports.getEditForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.render('editProduct', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading product');
  }
};


module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    console.log(req.file)
    if (req.file) {
      const oldProduct = await Product.findById(productId , path.filename);

      if (oldProduct && oldProduct.image) {
        const oldImagePath = path.join(__dirname, '../uploads', path.basename(oldProduct.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      data.image = '/uploads/' + req.file.filename;
    }
    await Product.findByIdAndUpdate(productId, data, { new: true });
    res.redirect('/products');
  } catch (err) {
    res.status(500).send('Error updating product');
  }
};

// Delete Product
module.exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting product');
  }
};

// Get All Products
module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products }); 
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error!");
  }
};
