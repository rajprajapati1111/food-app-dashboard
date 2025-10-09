const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const productSchema = new mongoose.Schema ({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    image: {
        type: String,
        required: true
    }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

productSchema.statics.upload = multer({ storage }).single('image')


module.exports = mongoose.model('Product', productSchema);