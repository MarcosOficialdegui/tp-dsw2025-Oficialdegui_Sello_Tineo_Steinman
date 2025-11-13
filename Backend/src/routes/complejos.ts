import { Router } from "express";
import { getComplejoById, getComplejos, getServiciosDisponibles, crearComplejo, eliminarComplejo, getReservasPorComplejo} from "../controllers/complejoController";
import { authMiddleware } from "../middleware/authMiddleware";
import { guardarComplejoEnUsuario } from "../controllers/usuarioController";
import { rolMiddleware } from "../middleware/RolMiddleware";

const router = Router();

router.get("/", getComplejos);
router.get("/servicios", getServiciosDisponibles); // Debe ir ANTES de /:id
router.get("/:id", getComplejoById);
router.get("/:id/reservas", authMiddleware, rolMiddleware, getReservasPorComplejo); // Nueva ruta
router.post("/", authMiddleware, rolMiddleware, crearComplejo, guardarComplejoEnUsuario); 
router.delete("/:id", authMiddleware, rolMiddleware, eliminarComplejo);
router.get("/:complejoId/reservas", authMiddleware, getReservasPorComplejo); // Nueva rutakgkbhbhjb



export default router;
