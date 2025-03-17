const express = require('express');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

//Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Cambiado a productRoutes
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.use('/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/', productRoutes); 


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});