const router = require("express").Router();
const {PaymentMethod, getAllPaymentCodeSync} = require('../helper/dbUtils');
const createToken = require('../controllers/CreateToken')

const unifiedcheckoutsdkUrl = 'https://apitest.cybersource.com/up/v1/assets/0.6.0/SecureAcceptance.js';
const paymentComponents=[];


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

const requireJS = {
        unifiedcheckout:[unifiedcheckoutsdkUrl]
    };


async function getPaymentComponents(){
    
    const paymentCodes = await getAllPaymentCodeSync();

    const components = await Promise.all(paymentCodes.map(async(code)=>{
        console.log('STarted foreach');
        const paymentMethod = new PaymentMethod(code);
        // console.log(await paymentMethod.isActive());
        const component = {
            code: code,
            isActive: await paymentMethod.isActive(),
            title: await paymentMethod.getTitle(), 
        }
        return component;
    }));

    
    console.log(components);
    console.log('end of foreach');
    // await Promise.all(components);
    
    return components;
}



router.post("/submit-shipping-address", (req, res) => {
    const {email, firstname, lastname, street1, country, state, city, postalcode}=req.body;
    const shippingAddress = new ShippingAddress(email, firstname, lastname, street1, country, state, city, postalcode);
    req.session.shippingAddress = shippingAddress;

    res.redirect('/checkout/payment');
})

router.get("/payment", async (req, res) => {
    const paymentComponents = await getPaymentComponents();
    console.log(paymentComponents);
    res.render('checkout/payment', {
        paymentComponents: paymentComponents,
        requireJS: requireJS
    });
    await createToken.execute();
})

module.exports = router;