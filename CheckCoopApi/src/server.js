require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Middleware de JWT
const authMiddleware = require('./middleware/auth');

// Routers
const authRouter = require('./routes/auth');
const expedientesRouter = require('./routes/expedientes');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 1️⃣ Rutas PÚBLICAS (sin token)
app.use('/', authRouter);

// 2️⃣ A partir de aquí, **todas** las rutas usan authMiddleware
app.use(authMiddleware);

// 3️⃣ Rutas PROTEGIDAS
app.use('/', expedientesRouter);
app.use('/users', usersRouter);  // <<< aquí montas /users

// 4️⃣ Ruta raíz protegida GET /
app.get('/', (req, res) => {
  res.json({
    message: 'API raíz protegida: estás autenticado',
    user: req.user
  });
});

// 5️⃣ 404 para cualquier otro endpoint
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// 6️⃣ Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
