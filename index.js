require('dotenv').config();
const mongoose = require('mongoose');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_DB).then(() => console.log('DB Online'));

// Rutas API
app.get('/', (req, res) => res.json({ welcome: 'Server online' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/seed', require('./routes/seed'));

app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));

app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/uploads', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
  console.log('Servidor corriendo Puerto: ' + process.env.PORT);
});
