const express = require('express');
const router = express.Router();
const controller = require('../controllers/Allcontroller');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/multer'); 

// Public routes
router.get('/', controller.getHome);
router.get('/register', controller.register);
router.post('/register', controller.registeruser);
router.get('/login', controller.login);
router.post('/login', controller.logindata);

// Logout route
router.get('/logout', controller.logout);

// Protected routes (JWT verify required)
router.get('/dashboard', verifyToken, controller.getProducts);
router.get('/products', verifyToken, controller.getProducts);
router.post('/add-product', verifyToken, upload.single('image'), controller.addproduct);
router.get('/edit/:id', verifyToken, controller.getEditForm);
router.post('/update/:id', verifyToken, upload.single('image'), controller.updateProduct);
router.get('/delete/:id', verifyToken, controller.deleteProduct);
router.get('/profile',verifyToken,upload.single('image'),controller.profile)

module.exports = router;
