const express = require('express');
const db = require('./src/config/db');
const path = require('path');
const port = 8000 ;


const app = express()

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))
app.use('/', require('./src/routes/productRoutes'))
app.use(express.json());
app.set('views',path.join(__dirname,'src','views'));
app.use('/uploads', express.static(path.join(__dirname, 'src' ,'uploads')));

app.listen(port,(err)=>{
    if (err) {
        console.log(err)
    }
    console.log("Server is running on port",port)
})