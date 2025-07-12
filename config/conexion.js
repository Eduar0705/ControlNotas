const mysql = require('mysql');

class Conexion {
    constructor() {
        this.conexion = mysql.createConnection({
            host: "mysql-sistems.alwaysdata.net",
            database: "sistems_bd",
            user: "sistems",
            password: "31466704"
        });

        this.conexion.connect((err) => {
            if (err) {
                throw err;
            } else {
                console.log("Conexión exitosa a la base de datos");
            }
        });
    }
}

module.exports = Conexion;