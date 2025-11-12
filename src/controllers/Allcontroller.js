const Product = require('../models/Product');
const Admin = require('../models/Admin');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = "MY_SECRET_KEY"; // .env me store karna better hai

// Home Page
module.exports.getHome = async (req, res) => {
  try {
    res.render('home');
  } catch (error) {
    console.log(error);
  }
};

// Register Page
module.exports.register = async (req, res) => {
  try {
    res.render('register');
  } catch (error) {
    console.log(error);
  }
};

// Register User
module.exports.registeruser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.render('register', { error: 'Admin already exists! Please Login' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({ email, password: hashedPassword });

    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error registering admin');
  }
};

// Login Page
module.exports.login = async (req, res) => {
  try {
    res.render('login', { error: null });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

// Login Data (Generate JWT)
module.exports.logindata = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.render('login', { error: 'Email not found!' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render('login', { error: 'Incorrect password!' });
    }

    // JWT Token Generate
    const token = jwt.sign({ id: admin._id, email: admin.email }, secret);

    // Cookie me token save
    res.cookie('token', token, { httpOnly: true, secure: false });
    return res.redirect('/');
  } catch (err) {
    console.log('Login error:', err);
    res.status(500).send('Internal server error');
  }
};

// Logout
module.exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// Add Product
module.exports.addproduct = async (req, res) => {
  try {

    const data = req.body;

    if (req.file) {
      data.image = '/uploads/' + req.file.filename;
    } else {
      return res.send("Please upload an image!");
    }

    await Product.create(data);

    return res.redirect('/products');
  } catch (error) {
    console.log("Error adding product:", error);
    res.status(500).json({ message: "Internal server error!" });
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

// Update Product
module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (req.file) {
      const oldProduct = await Product.findById(productId);
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

// Get All Products (Protected)
module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error!');
  }
};


// profile page

module.exports.profile = async (req,res) =>{
  try {
    const alluser = await Admin.find()
    res.render('profile',{alluser})
  } catch (error) {
    console.log(error)
  }
}
