const mongoose = require('mongoose');
require('dotenv').config();

const TipoCancha = require('../models/TipoCancha');
const Complejo = require('../models/Complejo');
const Cancha = require('../models/Cancha');

async function seed() {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    await TipoCancha.deleteMany({});
    await Complejo.deleteMany({});
    await Cancha.deleteMany({});


    const tipo = await TipoCancha.create({ nombre: 'Futbol 5' });

    const complejo = await Complejo.create({
      nombre: 'Parada 11',
      direccion: 'Aca noma',
      localidad: 'Funes'
    });

    const cancha = await Cancha.create({
      nombre: 'Cancha 1',
      tipoCancha: tipo._id,
      precioHora: 4400,
      complejo: complejo._id,
      disponible: true,
    });

    console.log('Todo ok');
  } catch (err) {
    console.error('Todo mal', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();

