const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api', (req, res) => {
  res.json({ mensaje: 'Hola desde Express' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const complejosRoutes = require('./routes/complejos');
app.use('/api/complejos', complejosRoutes);
