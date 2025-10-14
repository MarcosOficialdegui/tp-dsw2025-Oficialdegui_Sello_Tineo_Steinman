import { Router } from "express";
import { getComplejoById, getComplejos, getServiciosDisponibles, crearComplejo, eliminarComplejo} from "../controllers/complejoController";
import { authMiddleware } from "../middleware/authMiddleware";
import { guardarComplejoEnUsuario } from "../controllers/usuarioController";

const router = Router();

router.get("/", getComplejos);
router.get("/servicios", getServiciosDisponibles); // Debe ir ANTES de /:id
router.get("/:id", getComplejoById);
router.post("/", authMiddleware, crearComplejo, guardarComplejoEnUsuario); 
router.delete("/:id", authMiddleware, eliminarComplejo);
export default router;
