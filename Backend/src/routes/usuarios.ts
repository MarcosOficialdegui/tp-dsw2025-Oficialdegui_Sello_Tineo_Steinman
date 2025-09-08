import express, { Router } from "express";
import { createUsuario, generarToken, buscarUsuarioToken } from "../controllers/usuarioController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Rutas CRUD para Usuarios
router.post("/", createUsuario); // POST /api/usuarios - Crear nuevo usuario
router.post("/login", generarToken); // POST /api/usuarios/login - Buscar usuario por email y password



router.get("/perfil", authMiddleware, buscarUsuarioToken); 


export default router;
