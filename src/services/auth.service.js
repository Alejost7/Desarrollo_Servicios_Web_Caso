// Service/ Este archivo contiene la lógica de negocio y las consultas a MySQL.

// Importamos bcrypt para cifrar las contraseñas antes de guardarlas y pool para conectarnos a la base de datos MySQL

const bcrypt = require('bcrypt');
const pool = require('../config/db');

/**
 * Verificamos si un usuario ya existe en la base de datos.
 * @param {string} usuario - Nombre de usuario a buscar.
 * @return {Promise<boolean>} - Devuelve true si el usuario existe, false si no.
 */

async function existeUsuario(usuario){
    // Acá ejecutamos una consulta preparada para evitar inyecciones SQL.
    const [resultado] = await pool.execute(
        "SELECT id FROM usuarios WHERE usuario = ?", 
        [usuario]);
    // Si el resultado tiene al menos un registro, significa que el usuario existe.
    return resultado.length > 0;
}

/**
 * Registra un nuevo usuario en la base de datos.
 * @param {string} usuario - Nombre de usuario.
 * @param {string} contraseña - Contraseña en texto plano.
 * @returns {Promise<void>}
 */

async function registrarUsuario(usuario, contrasena){
    // Ciframos la contraseña antes de guardarla en la base de datos.
    const hash = await bcrypt.hash(contrasena, 10);

    // Insertamos el nuevo usuario en la base de datos
    await pool.execute(
        "INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)", 
        [usuario, hash]
    );
}

/**
 * Busca un usuario por su nombre de usuario.
 * @param {string} usuario - Nombre de usuario.
 * @returns {Promise<object|null>} Datos del usuario o null si no existe.
 */

async function buscarUsuario(usuario){
    // Consultamos usuario en la base de datos
    const [resultado] = await pool.execute(
        "SELECT id, usuario, contrasena FROM usuarios WHERE usuario = ?",
        [usuario]
    );
    // Si encontramos al menos un registro, devolvemos el primero; si no, vamos a devolver null.
    return resultado.length > 0 ? resultado[0] : null;
}

/**
 * Valida la contraseña enviada por el usuario contra el hash almacenado.
 * @param {string} contraseña - Contraseña enviada por el cliente.
 * @param {string} hashGuardado - Hash almacenado en la base de datos.
 * @returns {Promise<boolean>} true si la contraseña es válida.
 */

async function validarContrasena(contrasena, hashGuardado){
    // Comparamos la contraseña enviada con el hash almacenado en BD
    return await bcrypt.compare(contrasena, hashGuardado);
}

// Exportamos las funciones para usarlas en el controlador
module.exports = {
    existeUsuario,
    registrarUsuario,
    buscarUsuario,
    validarContrasena,
};


