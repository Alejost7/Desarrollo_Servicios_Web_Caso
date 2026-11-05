// server/ Punto de entrada: crea Express, carga middlewares y monta las rutas
// Importamos Express, el framework que permite crear el servicio web, luego importamos dotenv para leer las variables del archivo .env
const express = require('express');
require('dotenv').config();

// Importamos las rutas de autenticación definidas en auth.routes.js
const authRoutes = require('./routes/auth.routes');

// Creamos una instancia de Express
const app = express();

// Leemos el puerto desde las variables de entorno, si no está definido, usamos el puerto 3000
const PORT = process.env.PORT || 3000;

// Middleware incorporado de Express, permite que el servidor pueda leer datos JSON enviados en el cuerpo de la petición.
app.use(express.json());

// Montamos las rutas de autenticación usando el prefijo /api/auth. Esto significa que todas las rutas definidas en auth.routes.js estarán bajo /api/auth
app.use('/api/auth', authRoutes);

// Iniciamos el servidor y escuchamos en el puerto definido. Cuando el servidor esté listo, imprimimos un mensaje en la consola.
app.listen(PORT, () => {
    console.log(`SIIIUUUUUU Servidor escuchando en http://localhost:${PORT}`);
});
