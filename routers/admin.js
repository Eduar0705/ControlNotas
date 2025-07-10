const express = require('express');
const router = express.Router();
const db = require('../config/conexion');

router.get("/admin", function(req, res) {
    const conexion = new db();
    if (!req.session?.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión." });
    }

    // Consultas
    const queryProfesores = "SELECT * FROM inf_admins WHERE id_cargo = 2";
    const queryEstudiantes = "SELECT * FROM inf_estudiantes";
    
    // Ejecutar ambas consultas en paralelo
    conexion.conexion.query(queryProfesores, function(errProfesores, profesores) {
        if (errProfesores) {
            console.error("Error al consultar profesores:", errProfesores);
            return res.render("admin", { 
                datos: req.session,
                error: "Error al cargar los datos de profesores"
            });
        }

        conexion.conexion.query(queryEstudiantes, function(errEstudiantes, estudiantes) {
            if (errEstudiantes) {
                console.error("Error al consultar estudiantes:", errEstudiantes);
                return res.render("admin", { 
                    datos: req.session,
                    error: "Error al cargar los datos de estudiantes"
                });
            }

            const totalProfesores = profesores.length;
            const totalEstudiantes = estudiantes.length;
            
            // Renderizar vista con todos los datos
            res.render("admin", { 
                datos: req.session,
                profesores: profesores,
                estudiantes: estudiantes,
                totalProf: totalProfesores,
                totalEstu: totalEstudiantes,
                hayProfesores: totalProfesores > 0,
                hayEstudiantes: totalEstudiantes > 0
            });
        });
    });
});

module.exports = router;