



import mongoose from "mongoose";
import dotenv from "dotenv";
import Complejo from "./models/Complejo";
import path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("MONGO_URI =", process.env.MONGO_URI); 

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.error("❌ No se encontró MONGO_URI en .env");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB para seed");

    // Limpiar colección (opcional)
    await Complejo.deleteMany({});

    // Crear complejos de prueba
    const complejos = [
      {
        nombre: "Parada 11",
        direccion: "Aca noma",
        ciudad: "Rosario",
        canchas: [
          { tipoCancha: "futbol5", precioHora: 47000, disponible: true },
          { tipoCancha: "padel", precioHora: 30000, disponible: true }
        ]
      },
      {
        nombre: "Vale chumbar",
        direccion: "en el medio de la villa",
        ciudad: "Buenos Aires",
        canchas: [
          { tipoCancha: "futbol5", precioHora: 47000, disponible: true },
          { tipoCancha: "futbol7", precioHora: 50000, disponible: false },
          { tipoCancha: "padel", precioHora: 35000, disponible: true }
        ]
      }
    ];

    await Complejo.insertMany(complejos);

    console.log("✅ Seed completado: complejos cargados con canchas");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en el seed:", err);
    process.exit(1);
  }
}

seed(); 

