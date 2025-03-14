const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("ERROR: La variable JWT_SECRET no está definida en el archivo .env");
}

const generateToken = (user) => {
    if (!user || !user.id || !user.email || !user.rol) {
        throw new Error("ERROR: El usuario no tiene los datos necesarios para generar un token");
    }

    return jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error("Error verificando el token:", error.message);
        return null;
    }
};

module.exports = { generateToken, verifyToken };
