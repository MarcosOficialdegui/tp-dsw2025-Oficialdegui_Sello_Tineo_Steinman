import { Router } from 'express';
import { 
  getCiudades, 
  getCiudadById, 
  createCiudad, 
  updateCiudad, 
  deleteCiudad, 
} from '../controllers/ciudadController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();


// Rutas CRUD básicas
router.get('/', getCiudades);           // GET /api/ciudades - Listar ciudades
router.get('/:id', getCiudadById);      // GET /api/ciudades/:id - Obtener por ID
router.post('/', authMiddleware, createCiudad);         // POST /api/ciudades - Crear ciudad
router.put('/:id', authMiddleware, updateCiudad);       // PUT /api/ciudades/:id - Actualizar ciudad
router.delete('/:id', authMiddleware, deleteCiudad);    // DELETE /api/ciudades/:id - Eliminar ciudad

export default router;