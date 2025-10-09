const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/admin');

const db = mongoose.connection

db.once('open',(err)=>{
  if (err) {
    console.log(err)
    return false
 }
 console.log("Mongodb Database is Connected successfully !!")
})

