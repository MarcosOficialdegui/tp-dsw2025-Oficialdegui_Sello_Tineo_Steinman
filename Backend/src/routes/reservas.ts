import { Router } from "express";
import { crearReserva } from "../controllers/reservaController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();


//router.get("/", authMiddleware, getReservas);
router.post("/",authMiddleware, crearReserva);
//router.delete("/:id", authMiddleware, eliminarReserva);


export default router;
