import { Router } from "express";
import { getComplejoById, getComplejos, getServiciosDisponibles } from "../controllers/complejoController";

const router = Router();

router.get("/", getComplejos);
router.get("/servicios", getServiciosDisponibles); // Debe ir ANTES de /:id
router.get("/:id", getComplejoById);

export default router;
