const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Category = require('./Category');

const catalogueProductSchema = new mongoose.Schema({
    category:{
        type:ObjectId,
        required:true,
        ref: Category
    },
    skuid:{
        type:String,
        required: true,
        unique : true,
        min:4,
        max:30
    },
    title:{
        type:String,
        required: true,
        min:4,
        max:55
    },
    description:{
        type:String,
        required: true,
        min:4,
        max:255
    },
    price:{
        type:Number,
        required: true,
        min:0,
        max:100000
    }
});

module.exports = mongoose.model("catalogueProducts", catalogueProductSchema);