import express from 'express';
import { 
  getCanchas, 
  getCanchaById, 
  createCancha, 
  updateCancha, 
  deleteCancha 
} from '../controllers/canchaController';

const router = express.Router();

// Rutas CRUD para canchas
router.get('/', getCanchas);                    // GET /api/canchas - Obtener todas las canchas
router.get('/:id', getCanchaById);              // GET /api/canchas/:id - Obtener una cancha por ID
router.post('/', createCancha);                 // POST /api/canchas - Crear nueva cancha
router.put('/:id', updateCancha);               // PUT /api/canchas/:id - Actualizar cancha
router.delete('/:id', deleteCancha);            // DELETE /api/canchas/:id - Eliminar cancha

export default router;