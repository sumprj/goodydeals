const router = require("express").Router();
const sessionMiddleWare = require('../../helper/sessionMiddleWare');




router.get("/", sessionMiddleWare('admin','/admin'), (req, res) => {
    
    res.render("admin/login");
})



module.exports = router;