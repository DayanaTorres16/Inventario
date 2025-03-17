const express = require('express');
const bcrypt = require('bcrypt'); 
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const [admins] = await db.query('SELECT ID_ADMIN as id, NOMBRE_ADMIN as nombre, APELLIDO_ADMIN as apellido, EMAIL_ADMIN as email, "administrador" as rol FROM administrador');
        const [employees] = await db.query('SELECT ID_EMPLEADO as id, NOMBRE_EMPLEADO as nombre, APELLIDO_EMPLEADO as apellido, EMAIL_EMPLEADO as email, "empleado" as rol FROM empleado');
        const users = [...admins, ...employees];
        res.json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { nombre, apellido, email, contraseña, rol } = req.body;

        if (!nombre || !apellido || !email || !contraseña || !rol) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const [existingUser] = await db.query(
            'SELECT * FROM administrador WHERE EMAIL_ADMIN = ? UNION SELECT * FROM empleado WHERE EMAIL_EMPLEADO = ?',
            [email, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        if (rol === 'administrador') {
            await db.query(
                'INSERT INTO administrador (NOMBRE_ADMIN, APELLIDO_ADMIN, EMAIL_ADMIN, contraseña) VALUES (?, ?, ?, ?)',
                [nombre, apellido, email, hashedPassword]
            );
        } else if (rol === 'empleado') {
            await db.query(
                'INSERT INTO empleado (NOMBRE_EMPLEADO, APELLIDO_EMPLEADO, EMAIL_EMPLEADO, contraseña) VALUES (?, ?, ?, ?)',
                [nombre, apellido, email, hashedPassword]
            );
        } else {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
    }
});

router.get('/admins', async (req, res) => {
    try {
        const [results] = await db.query("SELECT ID_ADMIN as id, NOMBRE_ADMIN as nombre, APELLIDO_ADMIN as apellido, EMAIL_ADMIN as email, 'administrador' as rol FROM administrador");
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los administradores:', error);
        res.status(500).json({ error: 'Error al obtener los administradores' });
    }
});

router.get('/employees', async (req, res) => {
    try {
        const [results] = await db.query("SELECT ID_EMPLEADO as id, NOMBRE_EMPLEADO as nombre, APELLIDO_EMPLEADO as apellido, EMAIL_EMPLEADO as email, 'empleado' as rol FROM empleado");
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los empleados:', error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email } = req.body;

        const [admin] = await db.query('SELECT * FROM administrador WHERE ID_ADMIN = ?', [id]);
        if (admin.length > 0) {
            await db.query('UPDATE administrador SET NOMBRE_ADMIN = ?, APELLIDO_ADMIN = ?, EMAIL_ADMIN = ? WHERE ID_ADMIN = ?', [nombre, apellido, email, id]);
        } else {
            const [employee] = await db.query('SELECT * FROM empleado WHERE ID_EMPLEADO = ?', [id]);
            if (employee.length > 0) {
                await db.query('UPDATE empleado SET NOMBRE_EMPLEADO = ?, APELLIDO_EMPLEADO = ?, EMAIL_EMPLEADO = ? WHERE ID_EMPLEADO = ?', [nombre, apellido, email, id]);
            } else {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        }

        res.status(200).json({ message: 'Usuario actualizado correctamente' }); 
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).json({ error: 'Error al editar el usuario' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [admin] = await db.query('SELECT * FROM administrador WHERE ID_ADMIN = ?', [id]);
        if (admin.length > 0) {
            await db.query('DELETE FROM administrador WHERE ID_ADMIN = ?', [id]);
        } else {
            await db.query('DELETE FROM empleado WHERE ID_EMPLEADO = ?', [id]);
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

module.exports = router;
