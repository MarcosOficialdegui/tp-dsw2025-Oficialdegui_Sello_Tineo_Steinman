import mongoose, { Schema, Document } from "mongoose";

interface ICancha {
  tipoCancha: string;
  precioHora: number;
  disponible: boolean;
}

export interface IComplejo extends Document {
  nombre: string;
  direccion: string;
  ciudad: mongoose.Schema.Types.ObjectId;
  servicios: string[];
  canchas: ICancha[];
  horarioApertura: string;
  horarioCierre: string;
  imagen?: string; // Ruta de la imagen del complejo
}

const CanchaSchema = new Schema<ICancha>({
  tipoCancha: { type: String, required: true },
  precioHora: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
});

export const SERVICIOS_DISPONIBLES = [
  'Vestuario',
  'Estacionamiento',
  'Torneos',
  'Cumpleaños',
  'Parrilla',
  'Bar / Restaurante',
  'Quincho',
  'Wi-Fi',
  'Buffet',
  'Seguridad'
];

const ComplejoSchema = new Schema<IComplejo>({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ciudad",
    required: true
  },
  servicios: [{
    type: String,
    enum: SERVICIOS_DISPONIBLES,
    default: []
  }],
  canchas: [CanchaSchema],
  imagen: { type: String, required: false }, // Ruta de la imagen
  horarioApertura: { type: String, required: true, default: "08:00" },
  horarioCierre:   { type: String, required: true, default: "22:00" },
});

export default mongoose.model<IComplejo>("Complejo", ComplejoSchema);