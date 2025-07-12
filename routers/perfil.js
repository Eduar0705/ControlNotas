const express = require('express');
const router = express.Router();
const db = require('../config/conexion');

router.get("/admin/perfil", function(req, res) {
    const cone = new db();
    if (!req.session?.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión." });
    }

    // Consultas
    const queryProfesores = "SELECT * FROM inf_admins WHERE id_cargo = 2";
    const queryEstudiantes = "SELECT * FROM inf_estudiantes";
    const queryCursos = "SELECT * FROM cursos";

    // Ejecutar ambas consultas en paralelo
    cone.conexion.query(queryProfesores, function(errProfesores, profesores) {
        if (errProfesores) {
            console.error("Error al consultar profesores:", errProfesores);
            return res.render("admin", { 
                datos: req.session,
                error: "Error al cargar los datos de profesores"
            });
        }

        cone.conexion.query(queryEstudiantes, function(errEstudiantes, estudiantes) {
            if (errEstudiantes) {
                console.error("Error al consultar estudiantes:", errEstudiantes);
                return res.render("admin", { 
                    datos: req.session,
                    error: "Error al cargar los datos de estudiantes"
                });
            }
            cone.conexion.query(queryCursos, (errCursos, cursos)=>{
                if (errCursos) {
                    console.error("Error al consultar cursos:", errCursos);
                    return res.render("admin", { 
                        datos: req.session,
                        error: "Error al cargar los datos de cursos"
                    });
                }

                //Contadores
                const totalProfesores = profesores.length;
                const totalEstudiantes = estudiantes.length;
                const totalCursos = cursos.length;
            
                // Renderizar vista con todos los datos
                res.render("admin/perfil", { 
                    datos: req.session,
                    profesores: profesores,
                    estudiantes: estudiantes,
                    totalProf: totalProfesores,
                    totalEstu: totalEstudiantes,
                    hayProfesores: totalProfesores > 0,
                    hayEstudiantes: totalEstudiantes > 0,
                    cursos: cursos,
                    totalCursos: totalCursos
                });
            });
        });
    });
});

module.exports = router;