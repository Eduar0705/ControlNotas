const express = require('express');
const router = express.Router();
const conexion = require('../config/conexion');

router.get("/admin/soli", function(req, res) {
    const cone = new conexion();
    if (!req.session?.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión." });
    }

    const consultar = `SELECT * FROM soli_estudiantes`;
    cone.conexion.query(consultar, function(err, soli) {
        if (err) {
            console.error("Error al consultar estudiantes:", err);
            return res.render("admin", { 
                datos: req.session,
                error: "Error al cargar los datos de las solicitudes de los Estudiantes"
            });
        }
        const totalSolicitudes = soli.length;
        res.render("admin/soli", { 
            datos: req.session,
            totalSolicitudes: totalSolicitudes,
            soli : soli
        });
    });

});

module.exports = router;