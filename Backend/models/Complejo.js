const mongoose = require('mongoose');

const complejoSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  localidad: String, 
});

module.exports = mongoose.model('Complejo', complejoSchema);