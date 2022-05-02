const mongoose = require('mongoose');

const catalogueCategory = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        min:1,
        max:55
    },
})


module.exports = mongoose.model("catalogueCategories", catalogueCategory);