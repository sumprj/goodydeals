const router = require("express").Router();

router.get("/", async(req, res) => {
    // const admin = await Admin.findOne({});
    let siteName = 'sjjs';
    // if(admin && admin.siteName){
    //     siteName = admin.siteName;
    // }
    res.render("admin/setSiteName", {
        'shoppingSiteName': siteName
    });
})

router.post("/", async (req, res) => {
    const siteName = req.siteName;
    
})



module.exports = router;