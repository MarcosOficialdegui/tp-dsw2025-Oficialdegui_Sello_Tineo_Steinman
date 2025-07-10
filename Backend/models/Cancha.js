
const mongoose = require('mongoose');

const canchaSchema = new mongoose.Schema({
  nombre: String,
  tipoCancha: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoCancha' },
  precioHora: Number,
  complejo: { type: mongoose.Schema.Types.ObjectId, ref: 'Complejo' },
  disponible: Boolean,
});

module.exports = mongoose.model('Cancha', canchaSchema);
