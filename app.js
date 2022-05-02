const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser');
const axios = require('axios');
// const cors = require('cors');

const dbUtils = require('./helper/dbUtils');




dotenv.config();


try {
    mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser:true,
        useUnifiedTopology: true 
    },(error)=>{
        console.log('Mongoose DB connect callback called');
        console.log(error);
        dbUtils.createOwner(
            process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD,
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_FIRST_NAME,
            process.env.ADMIN_LAST_NAME
        )
        dbUtils.createSampleCatalogue();
    });    
} catch (error) {
    console.error("DATABASE CONNECTION FAILED!!");
}

const adminDashboardRoute = require('./routes/admin/dashboard');
const adminSetSiteNameRoute = require('./routes/admin/setSiteName');
const adminAddItemRoute = require('./routes/admin/addItem');
const adminLoginRoute = require('./routes/admin/index');
const homeRoute = require('./routes/index');
const checkoutRoute = require('./routes/checkout');
const { exit } = require('process');

const app = express();
// app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,"views/css")));
app.use(express.static(path.join(__dirname,"views/js")));

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap'));
app.use('/fontawesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery'));
app.use('/popperjs', express.static(__dirname + '/node_modules/popper.js'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')



/* app.use((req,res,next)=>{
    console.log(req.cookies);
    console.log(req.session.id);
    // req.session.destroy();
    console.log(req.session.id);
    console.log(req.cookies);
    res.send('slsl');
});
 */

port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});

// app.use("/admin", adminRoute);
app.use("/admin/dashboard", adminDashboardRoute);
app.use("/admin/set-site-name", adminSetSiteNameRoute);
app.use("/admin/add-item", adminAddItemRoute);
app.use("/admin", adminLoginRoute);
app.use("/", homeRoute);
app.use("/checkout", checkoutRoute);