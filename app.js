const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const adminRoute = require('./routes/admin/dashboard');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,"views/css")));
app.use(express.static(path.join(__dirname,"views/js")));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')


port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port "+port));





app.use("/admin", adminRoute);