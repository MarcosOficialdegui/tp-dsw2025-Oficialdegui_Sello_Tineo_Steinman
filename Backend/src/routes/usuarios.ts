import express, { Router } from "express";
import { createUsuario, findUsuario } from "../controllers/usuarioController";

const router: Router = express.Router();

// Rutas CRUD para Usuarios
router.post("/", createUsuario); // POST /api/usuarios - Crear nuevo usuario
router.post("/login", findUsuario); // POST /api/usuarios/login - Buscar usuario por email y password



export default router;
