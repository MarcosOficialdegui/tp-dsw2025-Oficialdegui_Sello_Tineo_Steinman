import mongoose from "mongoose";
import dotenv from "dotenv";
import Reserva from "../models/Reserva";

dotenv.config();

async function clearReservas() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Falta MONGO_URI en variables de entorno");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    const resultado = await Reserva.deleteMany({});
    console.log(`Reservas eliminadas: ${resultado.deletedCount ?? 0}`);
  } catch (error) {
    console.error("Error al limpiar reservas:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

void clearReservas();
