// Controller/ Recibe la petición, valida la entrada y devuelve la respueta HTTP. 
// Importamos el servicio de autenticación que contiene la lógica de negocio
const authService = require('../services/auth.service');

/**
 * Controlador para registrar un nuevo usuario.
 * @param {object} req - Objeto de petición de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */

async function registrarUsuario(req, res) {
    try {
        // Extraemos usuario y contraseña del cuerpo de la petición
        const {usuario, contrasena} = req.body;

        if (!usuario || !contrasena) {
            return res.status(400).json({exito: false, mensaje: "NOOOO El usuario y la contraseña son obligatorios."});
        }

        // Verificamos si el usuario ya existe, si existe, devolvemos un error 409 (conflicto)
        const existe = await authService.existeUsuario(usuario);
        if (existe) {
            return res.status(409).json({exito: false, mensaje: "Ya estás dentro!!!! El usuario ya existe."});
        }
        // Registramos el nuevo usuario
        await authService.registrarUsuario(usuario, contrasena);
        // Devolvemos una respuesta exitosa
        res.status(201).json({exito: true, mensaje: "SIIIUUUUUUUU Usuario registrado exitosamente."});

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({exito: false, mensaje: "Error interno del servidor."});
    }
}

/**
 * Controlador para iniciar sesión.
 * @param {object} req - Objeto de petición de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */

async function Login(req, res) {
    try {
        // Extraemos usuario y contraseña del cuerpo de la petición y validamos que los datos estén presentes
        const {usuario, contrasena} = req.body;
        if (!usuario || !contrasena) {
            return res.status(400).json({exito: false, mensaje: "El usuario y la contraseña son obligatorios."});
        }
        // Buscamos al usuario en la base de datos
        const usuarioEncontrado = await authService.buscarUsuario(usuario);
        if (!usuarioEncontrado) {
            return res.status(401).json({exito: false, mensaje: "Usuario o contraseña incorrectos."});
        }
        // Verificamos si la contraseña enviada coincide con el hash almacenado
        const esValido = await authService.validarContrasena(contrasena, usuarioEncontrado.contrasena);
        if (!esValido) {
            return res.status(401).json({exito: false, mensaje: "Usuario o contraseña incorrectos."});
        }
        // Si todo está bien, devolvemos una respuesta exitosa
        return res.status(200).json({exito: true, mensaje: "Inicio de sesión exitoso."});
    } catch (error){
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({exito: false, mensaje: "Error interno del servidor."});
    }
}

// Exportamos los controladores para que puedan ser utilizados en las rutas
module.exports = {
    registrarUsuario,
    Login,
};
