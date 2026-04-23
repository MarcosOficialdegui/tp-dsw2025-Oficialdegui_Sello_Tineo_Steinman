import mongoose from "mongoose";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

function getDuracionMinutos(canchaTipo: string): number {
  return /^padel$/i.test(String(canchaTipo ?? "").trim()) ? 90 : 60;
}

function sumarMinutos(horaInicio: string, minutos: number): string {
  const [hh, mm] = horaInicio.split(":").map(Number);
  const total = hh * 60 + mm + minutos;
  const horas = Math.floor(total / 60);
  const mins = total % 60;
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

async function migrateComplejos() {
  const collection = mongoose.connection.collection("complejos");
  const docs = await collection.find({}).toArray();

  let updated = 0;

  for (const doc of docs) {
    const canchas = Array.isArray((doc as any).canchas) ? (doc as any).canchas : [];
    let changed = false;

    const nuevasCanchas = canchas.map((cancha: any) => {
      const nueva = { ...cancha };

      if (nueva.precioTurno == null && nueva.precioHora != null) {
        nueva.precioTurno = nueva.precioHora;
        changed = true;
      }

      if ("precioHora" in nueva) {
        delete nueva.precioHora;
        changed = true;
      }

      return nueva;
    });

    if (changed) {
      await collection.updateOne({ _id: doc._id }, { $set: { canchas: nuevasCanchas } });
      updated += 1;
    }
  }

  return updated;
}

async function migrateCanchasCollection() {
  const collection = mongoose.connection.collection("canchas");
  const docs = await collection.find({}).toArray();
  let updated = 0;

  for (const doc of docs) {
    const setData: Record<string, unknown> = {};
    const unsetData: Record<string, ""> = {};

    if ((doc as any).precioTurno == null && (doc as any).precioHora != null) {
      setData.precioTurno = (doc as any).precioHora;
    }

    if ("precioHora" in (doc as any)) {
      unsetData.precioHora = "";
    }

    if (Object.keys(setData).length > 0 || Object.keys(unsetData).length > 0) {
      const update: Record<string, unknown> = {};
      if (Object.keys(setData).length > 0) update.$set = setData;
      if (Object.keys(unsetData).length > 0) update.$unset = unsetData;

      await collection.updateOne({ _id: doc._id }, update);
      updated += 1;
    }
  }

  return updated;
}

async function migrateReservas() {
  const collection = mongoose.connection.collection("reservas");
  const docs = await collection
    .find({
      $or: [{ horaFin: { $exists: false } }, { duracionMinutos: { $exists: false } }],
    })
    .toArray();

  let updated = 0;

  for (const doc of docs) {
    const canchaTipo = String((doc as any).canchaTipo ?? "");
    const horaInicio = String((doc as any).horaInicio ?? "");

    if (!horaInicio.includes(":")) {
      continue;
    }

    const duracionMinutos = (doc as any).duracionMinutos ?? getDuracionMinutos(canchaTipo);
    const horaFin = (doc as any).horaFin ?? sumarMinutos(horaInicio, duracionMinutos);

    await collection.updateOne(
      { _id: doc._id as ObjectId },
      {
        $set: {
          duracionMinutos,
          horaFin,
        },
      }
    );

    updated += 1;
  }

  return updated;
}

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Falta MONGO_URI en variables de entorno");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);

    const complejosUpdated = await migrateComplejos();
    const canchasUpdated = await migrateCanchasCollection();
    const reservasUpdated = await migrateReservas();

    console.log(`Complejos migrados: ${complejosUpdated}`);
    console.log(`Canchas migradas: ${canchasUpdated}`);
    console.log(`Reservas migradas: ${reservasUpdated}`);
  } catch (error) {
    console.error("Error en migración:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

void run();
