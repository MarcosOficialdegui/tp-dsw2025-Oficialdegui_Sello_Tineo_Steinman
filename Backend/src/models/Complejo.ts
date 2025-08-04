import { Schema, model } from 'mongoose';

interface Cancha {
  tipo: 'futbol5' | 'futbol7' | 'padel';
  cantidad: number;
}

interface Complejo {
  nombre: string;
  ciudad: string;
  direccion: string;
  canchas: Cancha[];
}

const canchaSchema = new Schema<Cancha>({
  tipo: { type: String, enum: ['futbol5', 'futbol7', 'padel'], required: true },
  cantidad: { type: Number, required: true },
});

const complejoSchema = new Schema<Complejo>({
  nombre: { type: String, required: true },
  ciudad: { type: String, required: true },
  direccion: { type: String, required: true },
  canchas: [canchaSchema],
});

export default model<Complejo>('Complejo', complejoSchema);

