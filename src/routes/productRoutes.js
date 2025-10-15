const express = require('express');
const product = require('../controllers/Allcontroller')
const upload = require('../models/Product')

const router = express.Router()

console.log("Router Access Successfully !!")

router.get('/', product.login)
router.post('/login' , product.logindata)
router.get("/Dashboard", product.getHome)
router.post('/addproduct',upload.upload,product.addproduct)
router.get("/edit/:id", product.getEditForm);
router.post("/editdata/:id", upload.upload, product.updateProduct);
router.get('/delete/:id', product.deleteProduct);
router.get('/products', product.getProducts);


module.exports = router