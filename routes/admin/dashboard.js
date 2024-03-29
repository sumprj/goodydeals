const router = require("express").Router();
const {findAllCatalogueProducts} = require('../../helper/dbUtils');

class Item{
    constructor(category, skuid, title, description, price){
        this.category = category;
        this.skuid = skuid;
        this.title = title;
        this.description = description;
        this.price = price;
    }
}

function getData() {
    return {
        'shoppingSiteName': "Amazon"
    }
}

/**
 * Returns Items as an array
 * @returns array
 */
function getItems(){
    return [
        new Item('Mobile', 'M1201', 'Iphone 12 plus', 'Latest iOS 6GB Ram with much more', 40000),
        new Item('Television', 'T003', 'LG OLED 40 Inch', 'LG new Smart OLED Television with much more', 50000)
    ]
}

router.get("/", (req, res) => {
    let data = getData();
    findAllCatalogueProducts((products)=>{
        console.log(products);
        res.render("admin/dashboard", {
            'shoppingSiteName': data.shoppingSiteName,
            'items': products
        });
    })
    
})



module.exports = router;