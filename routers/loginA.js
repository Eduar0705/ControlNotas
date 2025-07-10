const express = require('express');
const router = express.Router();
const conexion = require('../config/conexion');

router.post('/LoginA', (req, res) => {
    try {
        const con = new conexion();
        const { cedula, password } = req.body;
        let mensaje;

        // Validar campos vacíos primero
        if (!password || !cedula) {
            mensaje = "Debe ingresar cédula y contraseña";
            return res.render('login', { mensaje });
        }

        const validar = `SELECT * FROM inf_admins WHERE cedula = ? AND clave = ?`;
        con.conexion.query(validar, [cedula, password], (err, row) => {
            if (err) {
                console.error('Error en la consulta de usuarios', err);
                return res.status(500).render('login', { mensaje: "Error en el servidor" });
            }

            if (row.length <= 0) {
                mensaje = "Usuario o contraseña incorrectos";
                return res.render('login', { mensaje });
            }

            const admin = row[0];
            
            // Almacenar la sesión
            req.session.login = true;
            req.session.id = admin.id;
            req.session.cedula = admin.cedula;
            req.session.nombre_apellido = admin.nombre_apellido;
            req.session.email = admin.email;
            req.session.id_cargo = admin.id_cargo;
            req.session.especialidad = admin.especialidad;
            req.session.foto = admin.foto;
            
            console.log("Datos de sesión:", req.session);

            const contador = `SELECT COUNT(*) as total FROM inf_admins WHERE id_cargo = 1`;
            con.conexion.query(contador, (err, result) => {  // Cambiado row por result
                if (err) {
                    console.error('Error en la consulta de contador', err);
                    // No detenemos el flujo por este error
                } else {
                    req.session.totalUsuarios = result[0].total;
                    console.log("Total de usuarios registrados:", req.session.totalUsuarios);
                }

                // Redirección según cargo
                switch(admin.id_cargo) {
                    case 1:
                        return res.redirect('/admin');
                    case 2:
                        return res.redirect('/profe');
                    case 3:
                        return res.redirect('/users');
                    default:
                        mensaje = "Rol de usuario no válido";
                        return res.render('login', { mensaje });
                }
            });

        });
    } catch (error) {
        console.error('Error general en el login:', error);
        res.status(500).render('login', { mensaje: "Error en el servidor" });
    }
});

module.exports = router;