import express, { Router } from "express";
import { createUsuario, findUsuario } from "../controllers/usuarioController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Rutas CRUD para Usuarios
router.post("/", createUsuario); // POST /api/usuarios - Crear nuevo usuario
router.post("/login", findUsuario); // POST /api/usuarios/login - Buscar usuario por email y password


/*
router.get("/perfil", authMiddleware, (req, res) => {
  res.json({ message: "Acceso concedido a la ruta protegida", user: (req as any).user });
}); 
*/

export default router;
