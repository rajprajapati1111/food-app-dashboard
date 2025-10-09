const Product = require('../models/Product'); // capitalize to match model

// Home Page
module.exports.getHome = async (req, res) => {
  try {
    res.render('home');
  } catch (error) {
    console.log(error);
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
    
    console.log(data)

    if (req.file) {

      const oldProduct = await Product.findById(productId);
      if (oldProduct && oldProduct.image) {
        const oldImagePath = path.join(__dirname, '..', oldProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); 
        }
      }

      data.image = 'uploads/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(productId, data);
    res.redirect('/products');
  } catch (err) {
    console.error(err);
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
