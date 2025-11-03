import mongoose from "mongoose";
import { Schema } from "mongoose";

interface IReserva {
    user: mongoose.Schema.Types.ObjectId;
    complejo: mongoose.Schema.Types.ObjectId;
    canchaId: string;
    canchaTipo: string; 
    fecha: Date; // Dia
    horaInicio: string; // Formato "HH:mm"
    creadoEn: Date;
}

const reservaSchema = new mongoose.Schema<IReserva>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    complejo: { type: mongoose.Schema.Types.ObjectId, ref: "Complejo", required: true },
    canchaId: {type: String, required: true }, 
    canchaTipo: {type: String, required: true},
    fecha: { type: Date, required: true },
    horaInicio: { type: String, required: true },
    creadoEn: { type: Date, default: Date.now }
});

export default mongoose.model<IReserva>("Reserva", reservaSchema);