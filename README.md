# Servicio web de autenticación

Servicio web REST básico para registrar usuarios e iniciar sesión. El proyecto
está desarrollado con Node.js y Express, y utiliza MySQL local como sistema de
persistencia. Las contraseñas no se almacenan en texto plano: se protegen con
`bcrypt` antes de guardarse.

## Tecnologías

- Node.js
- Express 5
- MySQL
- MySQL Workbench para administrar la base de datos local
- `mysql2` para la conexión con MySQL
- `bcrypt` para el hash de contraseñas
- `dotenv` para cargar variables de entorno
- `nodemon` para el desarrollo

## Estructura del proyecto

```text
src/
├── config/
│   └── db.js                 # Pool de conexiones a MySQL
├── controllers/
│   └── auth.controller.js    # Validación de peticiones y respuestas HTTP
├── routes/
│   └── auth.routes.js        # Rutas de autenticación
├── services/
│   └── auth.service.js       # Lógica de negocio y consultas SQL
└── server.js                 # Punto de entrada de la aplicación
```

## Base de datos

La aplicación utiliza una base de datos MySQL local administrada con MySQL
Workbench. Solo se requiere una tabla llamada `usuarios`, con las columnas
necesarias para identificar al usuario y almacenar el hash de su contraseña.

En MySQL Workbench se puede crear con:

```sql
CREATE DATABASE IF NOT EXISTS auth_evidencia;
USE auth_evidencia;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);
```

La columna `contrasena` contiene el hash generado por `bcrypt`, no la
contraseña original.

## Configuración

1. Instala Node.js.
2. Crea la base de datos y la tabla con el script anterior desde MySQL
   Workbench.
3. Copia `.env.example` como `.env`.
4. Ajusta en `.env` el usuario, contraseña y nombre de la base de datos de tu
   instalación local de MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=auth_app
DB_PASSWORD=tu_contraseña
DB_NAME=auth_evidencia
```

El archivo `.env` no debe subirse al repositorio porque contiene información
privada de conexión.

## Instalación y ejecución

Instala las dependencias:

```bash
npm install
```

Inicia el servidor en modo normal:

```bash
npm start
```

Para desarrollo, con reinicio automático:

```bash
npm run dev
```

El servicio queda disponible en `http://localhost:3000`.

## API

Todas las rutas de autenticación usan el prefijo `/api/auth`.

### Registrar usuario

**POST** `/api/auth/registro`

```json
{
  "usuario": "ana",
  "contrasena": "MiClaveSegura123"
}
```

Respuesta exitosa (`201 Created`):

```json
{
  "exito": true,
  "mensaje": "SIIIUUUUUUUU Usuario registrado exitosamente."
}
```

### Iniciar sesión

**POST** `/api/auth/login`

```json
{
  "usuario": "ana",
  "contrasena": "MiClaveSegura123"
}
```

Respuesta exitosa (`200 OK`):

```json
{
  "exito": true,
  "mensaje": "Inicio de sesión exitoso."
}
```

### Respuestas de error principales

- `400 Bad Request`: faltan `usuario` o `contrasena`.
- `401 Unauthorized`: usuario inexistente o contraseña incorrecta.
- `409 Conflict`: el usuario ya está registrado.
- `500 Internal Server Error`: error interno del servidor.

## Flujo de la aplicación

1. `server.js` carga las variables de entorno, habilita JSON y registra las
   rutas de autenticación.
2. El controlador valida los datos recibidos y construye la respuesta HTTP.
3. El servicio consulta la tabla `usuarios` mediante consultas preparadas.
4. En el registro, `bcrypt` genera el hash de la contraseña.
5. En el inicio de sesión, `bcrypt` compara la contraseña recibida con el hash
   almacenado.

## Estado del proyecto

Actualmente incluye registro e inicio de sesión básicos. No implementa tokens
JWT, sesiones, recuperación de contraseña ni roles de usuario.