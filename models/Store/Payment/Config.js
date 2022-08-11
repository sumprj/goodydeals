const mongoose = require('mongoose');
const {getLocales} = require('../../locale')

const storePaymentConfigSchema = new mongoose.Schema({
    paymentCode:{
        type: String,
        required: true,
        unique:true,
        min:1,
        max:55
    },
    enabled: {
        type: Number,
        enum: [0,1],
        default:0
    },
    productionMode: {
        type: Number,
        enum: [0,1],
        default:1
    },
    title: {
        type: String,
        min:1,
        max:55
    },
    merchantId: {
        type:String,
        min:3,
        max:33
    },

    restKeyId: {
        type: String,
        min:10,
        max: 255
    },
    cardTypes: {
        type: Array,
        default: ['VISA', 'MASTERCARD'],
    },
    restSharedSecret: {
        type:String,
        min:15,
        max:255
    },
    locale: {
        type: Number,
        default:'en_us',
        enum: getLocales()
    }
})

/**
 * enable, title, merchant id, rest key id, rest shared secret, production mode, locale
 */


module.exports = mongoose.model("storePaymentConfig", storePaymentConfigSchema);