import mongoose, { Schema, Document } from "mongoose";

interface ICancha {
  tipoCancha: string;
  precioHora: number;
  disponible: boolean;
}

interface ICiudad {
  nombre: string;
  creadaPor: string;
}

export interface IComplejo extends Document {
  nombre: string;
  direccion: string;
  ciudad: mongoose.Schema.Types.ObjectId;
  servicios: string[]; // Array de servicios disponibles
  canchas: ICancha[];
}

const CanchaSchema = new Schema<ICancha>({
  tipoCancha: { type: String, required: true },
  precioHora: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
});

// Servicios predeterminados disponibles
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
});

export default mongoose.model<IComplejo>("Complejo", ComplejoSchema);
