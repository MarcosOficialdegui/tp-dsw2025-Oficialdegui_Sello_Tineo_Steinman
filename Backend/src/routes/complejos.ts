import { Router } from "express";
import { getComplejoById, getComplejos, getServiciosDisponibles, crearComplejo} from "../controllers/complejoController";

const router = Router();

router.get("/", getComplejos);
router.get("/servicios", getServiciosDisponibles); // Debe ir ANTES de /:id
router.get("/:id", getComplejoById);
router.post("/", crearComplejo); 
export default router;
