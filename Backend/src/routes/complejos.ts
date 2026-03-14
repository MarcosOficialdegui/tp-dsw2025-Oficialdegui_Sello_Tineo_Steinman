import { Router } from "express";
import { getComplejoById, getServiciosDisponibles, crearComplejo, eliminarComplejo, getReservasPorComplejo, actualizarImagenComplejo, getDisponibilidad, getComplejos } from "../controllers/complejoController";
import { authMiddleware } from "../middleware/authMiddleware";
import { guardarComplejoEnUsuario } from "../controllers/usuarioController";
import { rolMiddleware } from "../middleware/RolMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", getComplejos); 
router.get("/servicios", getServiciosDisponibles); // Debe ir ANTES de /:id
router.get("/:id", getComplejoById);
router.get("/:id/disponibilidad", authMiddleware, getDisponibilidad);
router.get("/:id/reservas", authMiddleware, rolMiddleware, getReservasPorComplejo); // Nueva ruta
router.post("/", authMiddleware, rolMiddleware, upload.single('imagen'), crearComplejo, guardarComplejoEnUsuario); 
router.put("/:id/imagen", authMiddleware, rolMiddleware, upload.single('imagen'), actualizarImagenComplejo);
router.delete("/:id", authMiddleware, rolMiddleware, eliminarComplejo);
router.get("/:complejoId/reservas", authMiddleware, getReservasPorComplejo); // Nueva ruta



export default router;
