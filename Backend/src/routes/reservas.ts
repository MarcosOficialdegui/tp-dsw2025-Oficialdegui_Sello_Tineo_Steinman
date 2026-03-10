import { Router } from "express";
import { buscarReserva, crearReserva, obtenerReservasPorUsuario, obtenerHorariosOcupados} from "../controllers/reservaController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Horarios ocupados
router.get("/horarios-ocupados", authMiddleware, obtenerHorariosOcupados);


//router.get("/", authMiddleware, getReservas);
router.post("/",authMiddleware, buscarReserva ,crearReserva);
router.post("/mis-reservas", authMiddleware, obtenerReservasPorUsuario);
//router.delete("/:id", authMiddleware, eliminarReserva);


export default router;
