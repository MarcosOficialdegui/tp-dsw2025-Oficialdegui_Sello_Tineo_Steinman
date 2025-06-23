const mongoose = require('mongoose');

const tipoCanchaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
});

module.exports = mongoose.model('TipoCancha', tipoCanchaSchema);