const express = require('express');
const router = express.Router();

router.get("/admin", function(req, res) {
    /*if (!req.session || !req.session.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión."});
    }*/
    res.render("admin", { datos: req.session});
});


module.exports = router;