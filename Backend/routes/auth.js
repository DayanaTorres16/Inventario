const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/authToken');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
        // Buscar al usuario en la tabla de administradores
        let [rows] = await db.query('SELECT * FROM administrador WHERE EMAIL_ADMIN = ?', [email]);
        let user = rows.length > 0 ? rows[0] : null;
        let role = user ? 'administrador' : null;

        // buscarlo en la tabla de empleados
        if (!user) {
            [rows] = await db.query('SELECT * FROM empleado WHERE EMAIL_EMPLEADO = ?', [email]);
            user = rows.length > 0 ? rows[0] : null;
            role = user ? 'empleado' : null;
        }

        // Si no se encuentra
        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Comparar la contraseña con la base de datos
        const isMatch = await bcrypt.compare(password, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar el token para el usuario 
        const token = generateToken({
            id: user.ID_ADMIN || user.ID_EMPLEADO, 
            email: user.EMAIL_ADMIN || user.EMAIL_EMPLEADO, 
            rol: role
        });

        // Enviar los datos del usuario y el token
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: { 
                id: user.ID_ADMIN || user.ID_EMPLEADO, 
                nombre: user.NOMBRE_ADMIN || user.NOMBRE_EMPLEADO, 
                email: user.EMAIL_ADMIN || user.EMAIL_EMPLEADO, 
                rol: role
            },
            token: token
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
});

// Rutas protegidas para el Dashboard
router.get('/', authenticateUser, (req, res) => {
    try {
        res.status(200).json({
            mensaje: `Bienvenido al Dashboard, ${req.user.nombre}`,
            usuario: req.user
        });
    } catch (error) {
        console.error("Error en el Dashboard:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta protegida solo para administradores
router.get('/admin', authenticateUser, authorizeRole(['administrador']), (req, res) => {
    try {
        res.status(200).json({
            mensaje: 'Sección exclusiva para administradores',
            usuario: req.user
        });
    } catch (error) {
        console.error("Error en la ruta de administrador:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta protegida solo para empleados
router.get('/empleado', authenticateUser, authorizeRole(['empleado']), (req, res) => {
    try {
        res.status(200).json({
            mensaje: 'Sección exclusiva para empleados',
            usuario: req.user
        });
    } catch (error) {
        console.error("Error en la ruta de empleado:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
