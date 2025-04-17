require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/registro', require('./routes/registro'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/fichar', require('./routes/fichar'));
app.use('/api/historial', require('./routes/historial'));
app.use('/api/inventario', require('./routes/inventario'));
app.use('/api/puestos', require('./routes/puestos'));
app.use('/api/2fa', require('./routes/twofa'));

app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));