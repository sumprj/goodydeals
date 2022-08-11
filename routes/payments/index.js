const router = require("express").Router();

router.get("unified/cc", sessionMiddleWare('admin','/admin'), (req, res) => {
    
    
    res.render("admin/login");
})

module.exports = router;