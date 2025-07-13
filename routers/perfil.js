const express = require('express');
const router = express.Router();
const db = require('../config/conexion');

router.get("/admin/perfil", function(req, res) {
    const cone = new db();
    
    // Verificar sesión
    if (!req.session?.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión." });
    }

    // Consultas SQL
    const queries = {
        profesores: "SELECT * FROM inf_admins WHERE id_cargo = 2",
        estudiantes: "SELECT * FROM inf_estudiantes",
        cursos: "SELECT * FROM cursos",
        solicitudes: "SELECT * FROM soli_estudiantes"
    };

    // Ejecutar consultas en serie para manejar dependencias
    cone.conexion.query(queries.profesores, (errProfesores, profesores) => {
        if (errProfesores) {
            console.error("Error al consultar profesores:", errProfesores);
            return res.render("admin", {
                datos: req.session,
                error: "Error al cargar los datos de profesores"
            });
        }

        cone.conexion.query(queries.estudiantes, (errEstudiantes, estudiantes) => {
            if (errEstudiantes) {
                console.error("Error al consultar estudiantes:", errEstudiantes);
                return res.render("admin", {
                    datos: req.session,
                    error: "Error al cargar los datos de estudiantes"
                });
            }

            cone.conexion.query(queries.cursos, (errCursos, cursos) => {
                if (errCursos) {
                    console.error("Error al consultar cursos:", errCursos);
                    return res.render("admin", {
                        datos: req.session,
                        error: "Error al cargar los datos de cursos"
                    });
                }

                cone.conexion.query(queries.solicitudes, (errSolicitudes, soli) => {
                    if (errSolicitudes) {
                        console.error("Error al consultar solicitudes:", errSolicitudes);
                        return res.render("admin", {
                            datos: req.session,
                            error: "Error al cargar los datos de solicitudes"
                        });
                    }

                    // Calcular totales
                    const totals = {
                        profesores: profesores.length,
                        estudiantes: estudiantes.length,
                        cursos: cursos.length,
                        solicitudes: soli.length
                    };

                    // Renderizar vista con todos los datos
                    res.render("admin/perfil", {
                        datos: req.session,
                        profesores: profesores,
                        estudiantes: estudiantes,
                        cursos: cursos,
                        totalProf: totals.profesores,
                        totalEstu: totals.estudiantes,
                        totalCursos: totals.cursos,
                        totalSoli: totals.solicitudes,
                        hayProfesores: totals.profesores > 0,
                        hayEstudiantes: totals.estudiantes > 0
                    });
                });
            });
        });
    });
});

module.exports = router;