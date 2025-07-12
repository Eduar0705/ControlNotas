const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3007;

//CONFIGURACIONES
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Configuración de la session
app.use(session({
    secret: 'mi-clave-secreta',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 15 * 60 * 1000, // 15 minutos
        httpOnly: true
    }
}));

//RUTAS ESTATICAS
app.use(express.static('public'));
app.use(require('./routers/login'));
app.use(require('./routers/registro'));
app.use(require('./routers/loginA'));
app.use(require('./routers/config'));
app.use(require('./routers/perfil'));

//RUTAS DE ADMINISTRADOR
app.use(require('./routers/admin'));

//RUTAS DE PROFESOR
//app.use(require('./routers/profesor'));

//RUTAS DE ALUMNO
//app.use(require('./routers/alumno'));


app.listen(PORT, function(){
    if(PORT === 3007){
        console.log("Servidor corriendo en: http://localhost:3007");
    } else {
        console.log(PORT);
    }
});