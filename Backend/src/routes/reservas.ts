import { Router } from "express";
import { buscarReserva, crearReserva, obtenerReservasPorUsuario} from "../controllers/reservaController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();


//router.get("/", authMiddleware, getReservas);
router.post("/",authMiddleware, buscarReserva ,crearReserva);
router.post("/mis-reservas", authMiddleware, obtenerReservasPorUsuario);
//router.delete("/:id", authMiddleware, eliminarReserva);


export default router;
