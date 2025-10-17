import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import complejosRoutes from "./routes/complejos";
import canchasRoutes from "./routes/canchas";
import usuariosRoutes from "./routes/usuarios";
import ciudadesRoutes from "./routes/ciudades";
import reservasRoutes from "./routes/reservas";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/complejos", complejosRoutes);
app.use("/api/canchas", canchasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/ciudades", ciudadesRoutes);
app.use("/api/reservas", reservasRoutes);

const PORT = process.env.PORT || 5000;


const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.error("no se encontro MONGO_URI en .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("todo bien con mongo");
    app.listen(PORT, () => {
      console.log(`servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("todo mal con mongo", err);
    process.exit(1);
  });
