
import mongoose from 'mongoose';

interface ICancha extends mongoose.Document {
  nombre: string;
  tipoCancha: 'Futbol 5' | 'Futbol 7' | 'Padel';
  precioHora: number;
  complejo: mongoose.Schema.Types.ObjectId;
  disponible: boolean;
}

const canchaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tipoCancha: { 
    type: String,
    required: true,
    enum: ['Futbol 5', 'Futbol 7', 'Padel'], 
    trim: true
  },
  precioHora: {
    type: Number,
    required: true,
    min: 0
  },
  complejo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Complejo',
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model<ICancha>("Cancha", canchaSchema);