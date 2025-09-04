import mongoose, { Schema, Document } from "mongoose";

interface ICancha {
  tipoCancha: string;
  precioHora: number;
  disponible: boolean;
}

export interface IComplejo extends Document {
  nombre: string;
  direccion: string;
  ciudad: string; 
  canchas: ICancha[];
}

const CanchaSchema = new Schema<ICancha>({
  tipoCancha: { type: String, required: true },
  precioHora: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
});

const ComplejoSchema = new Schema<IComplejo>({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true }, 
  canchas: [CanchaSchema],
});

export default mongoose.model<IComplejo>("Complejo", ComplejoSchema);
