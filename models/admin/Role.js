const mongoose = require('mongoose');

const AdminRoleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        min:1,
        max:55
    },
    privileges: {
        type: Number,
        required: true,
        enum: [1,2,3,4,5]
    }
})


module.exports = mongoose.model("AdminRole", AdminRoleSchema);