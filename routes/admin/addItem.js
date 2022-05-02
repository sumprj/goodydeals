const router = require("express").Router();
const catalogueCategory = require('../../models/Catalogue/Category');
const CatalogueProduct = require('../../models/Catalogue/Products');
const {findCatalogueCategories, findCatalogueProductBySkuid, addNewProduct} = require('../../helper/dbUtils');


async function getCategoriesSync(){
    let categoryFormatted = [];
    try{
        categories = await catalogueCategory.find({});
        console.log(categories);
        categoryFormatted = categories.map(categoryObj => {
            return {id: categoryObj._id, name: categoryObj.categoryName};
        });
        console.log(categoryFormatted);
    }catch(error){
        console.error(error);
    }
    return categoryFormatted;
}

router.get("/", async(req, res) => {
    // const admin = await Admin.findOne({});
    let siteName = 'sjjs';
    // if(admin && admin.siteName){
    //     siteName = admin.siteName;
    // }
    
    res.render("admin/addItem",{
        category: await getCategoriesSync()
    });
})

router.post("/", async (req, res) => {
    console.log(req.body);
    let postResponse = {};
    const {category, skuid, title, description, price} = req.body;
    postResponse = {
        errorMessage: '',
        category: await getCategoriesSync(),
        skuid:skuid,
        title:title,
        description: description,
        price:price
    }
    response = addNewProduct({
        category: category,
        skuid: skuid,
        title: title,
        description: description,
        price: price
    },(response)=>{
        console.log('callback called');
        if(response.error){
            postResponse.errorMessage = response.errorMessage;
            res.render("admin/addItem",postResponse);
        }
        else{
            postResponse.successMessage = "Your Product was successfully saved.";
            res.send(postResponse);
        }
            
    });
    
    
})


module.exports = router;