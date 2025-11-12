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



module.exports = mongoose.model('Product', productSchema);