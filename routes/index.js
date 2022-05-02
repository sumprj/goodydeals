const router = require("express").Router();
const sessionMiddleWare = require('../helper/sessionMiddleWare')
const {findAllCatalogueProducts} = require('../helper/dbUtils');

class Item{
    constructor(category, skuid, title, description, price){
        this.category = category;
        this.skuid = skuid;
        this.title = title;
        this.description = description;
        this.price = price;
    }
}


function getItems(){
    return [
        new Item('Mobile', 'M1201', 'Iphone 12 plus', 'Latest iOS 6GB Ram with much more', 40000),
        new Item('Television', 'T003', 'LG OLED 40 Inch', 'LG new Smart OLED Television with much more', 50000)
    ]
}

router.use(sessionMiddleWare('store','/'));

router.get("/", (req, res) => {
    console.log(req.session);
    findAllCatalogueProducts((products)=>{
        res.render("index",{'items':products, cart: req.cookies.cart});
    })
})

router.post("/add-to-cart", (req, res) => {
    console.log(req.session);
    console.log(req.body.skuid);
    if(req.body.skuid && !req.session.cart){
        req.session.cart={};
    }
    if(req.session.cart[req.body.skuid]){
        req.session.cart[req.body.skuid]++;
    }
    else
        req.session.cart[req.body.skuid] = 1;
    console.log(req.session);
    res.redirect('/');
})



module.exports = router;