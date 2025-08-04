import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import complejosRoutes from './routes/complejos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/complejos', complejosRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('conectado a mongo');
    app.listen(PORT, () => {
      console.log(`servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('todo mal con mongo', err);
  });


