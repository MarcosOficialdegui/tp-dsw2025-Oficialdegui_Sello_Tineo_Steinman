import express, { Router } from "express";
import { createUsuario } from "../controllers/usuarioController";

const router: Router = express.Router();

// Rutas CRUD para Usuarios
router.post("/", createUsuario); // POST /api/usuarios - Crear nuevo usuario

export default router;
