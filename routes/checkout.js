const router = require("express").Router();

const unifiedcheckoutsdkUrl = 'https://apitest.cybersource.com/up/v1/assets/0.6.0/SecureAcceptance.js';
router.get("/", (req, res) => {
    res.render("checkout/shipping");
})

class Address{
    constructor(email, firstname, lastname, street1, country, state, city, postalcode){
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.street1 = street1;
        this.country = country;
        this.state = state;
        this.city = city;
        this.postalcode = postalcode;
    }
}

class ShippingAddress extends Address{
    constructor(email, firstname, lastname, street1, country, state, city, postalcode)
    {
        super(email, firstname, lastname, street1, country, state, city, postalcode)
    }
}

samplePaymentObject = {
    payments:[
        {
            'title': 'Unified Checkout',
            'id':'unifiedcheckout',
        }
    ],
    requireJS:{
        unifiedcheckout:[unifiedcheckoutsdkUrl]
    }
}


router.post("/submit-shipping-address", (req, res) => {
    const {email, firstname, lastname, street1, country, state, city, postalcode}=req.body;
    const shippingAddress = new ShippingAddress(email, firstname, lastname, street1, country, state, city, postalcode);
    req.session.shippingAddress = shippingAddress;
    
    res.redirect('/checkout/payment');
})

router.get("/payment", (req, res) => {
    res.render('checkout/payment', samplePaymentObject);
})

module.exports = router;