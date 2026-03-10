import { Router } from "express";
import { getEstadisticasComplejo, getMisComplejosDashboard } from "../controllers/estadisticasController";
import { authMiddleware } from "../middleware/authMiddleware";
import { rolMiddleware } from "../middleware/RolMiddleware";

const router = Router();

router.get("/mis-complejos", authMiddleware, rolMiddleware, getMisComplejosDashboard);
router.get("/complejo/:id", authMiddleware, rolMiddleware, getEstadisticasComplejo);

export default router;