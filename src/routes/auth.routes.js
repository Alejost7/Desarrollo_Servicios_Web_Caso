// Routes/ Define las URLs y el método HTTP. No contiene lógica de negocio, solo llama a los controladores correspondientes
// Importamos express para crear un router modular
const express = require('express');
// Importamos los controladores de autenticación
const authController = require('../controllers/auth.controller');

// Creamos una instancia router de Express
const router = express.Router();

/**
 * Ruta para registrar un usuario.
 * POST /api/auth/registro
 */
router.post("/registro", authController.registrarUsuario);

/**
 * Ruta para iniciar sesión.
 * POST /api/auth/login
 */
router.post("/login", authController.Login);

// Exportamos el router para que pueda ser usado en server.js
module.exports = router;