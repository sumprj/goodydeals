const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Role = require('./Role');

const AdminUserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        min:4,
        max:30
    },
    password:{
        type:String,
        required: true,
        min:8,
        max:255
    },
    firstName:{
        type:String,
        required: true,
        min:4,
        max:30
    },
    lastName:{
        type:String,
        required: true,
        min:4,
        max:30
    },
    email:{
        type:String,
        required: true,
        min:7,
        max:55
    },
    role:{
        type: ObjectId,
        required:true,
        ref: Role
    }
});

module.exports = mongoose.model("AdminUsers", AdminUserSchema);