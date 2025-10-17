import mongoose from "mongoose";



interface IReserva {
    user: mongoose.Schema.Types.ObjectId;
    complejo: mongoose.Schema.Types.ObjectId;
    cancha: mongoose.Schema.Types.ObjectId;// Tipo de cancha reservada
    fecha: Date; // Dia
    horaInicio: string; // Formato "HH:mm"
    creadoEn: Date;
}

const reservaSchema = new mongoose.Schema<IReserva>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    complejo: { type: mongoose.Schema.Types.ObjectId, ref: "Complejo", required: true },
    cancha: { type: mongoose.Schema.Types.ObjectId, ref: "Cancha", required: true  },
    fecha: { type: Date, required: true },
    horaInicio: { type: String, required: true },
    creadoEn: { type: Date, default: Date.now }
});

export default mongoose.model<IReserva>("Reserva", reservaSchema);