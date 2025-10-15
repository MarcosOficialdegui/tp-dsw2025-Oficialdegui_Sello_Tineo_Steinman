import { Request, Response } from "express";
import Ciudad from "../models/Ciudad";
import { error } from "console";

// GET /api/ciudades - Obtener todas las ciudades
export const getCiudades = async (req: Request, res: Response) => {
    try {
        const { busqueda } = req.query;
        const query: any = {};
        if (busqueda) query.nombre = new RegExp(busqueda as string, 'i');

        const ciudades = await Ciudad.find(query).sort({ nombre: 1 });
        res.json(ciudades);
    } catch (error) {
        console.error('Error al obtener ciudades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// GET /api/ciudades/:id - Obtener una ciudad por ID
export const getCiudadById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ciudad = await Ciudad.findById(id);
        if (!ciudad) {
            return res.status(404).json({ error: 'Ciudad no encontrada' });
        }
        res.json(ciudad);
    } catch (error) {
        console.error('Error al obtener ciudad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// POST /api/ciudades - Crear una nueva ciudad
export const createCiudad = async (req: Request, res: Response) => {
    try {
        const { nombre, creadaPor } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la ciudad es obligatorio' });
        }

        const ciudadExistente = await Ciudad.findOne({
            nombre: new RegExp(`^${nombre}$`, 'i')
        })

        if (ciudadExistente) {
            return res.status(400).json({ error: 'La ciudad ya existe' });
        }

        const nuevaCiudad = new Ciudad({ nombre, creadaPor: creadaPor || 'propietario' });

        const ciudadGuardada = await nuevaCiudad.save();

        res.status(201).json({
            message: 'Ciudad creada exitosamente',
            ciudad: ciudadGuardada,
        });
    } catch (error: any) {
        console.error('Error al crear ciudad:', error);
        
        if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ error: errores.join(', ') });
    }
        
        if (error.code === 11000) {
        return res.status(409).json({ 
            error: 'Ya existe una ciudad con ese nombre' 
        });
    }
        
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// PUT /api/ciudades/:id - Actualizar una ciudad por ID - (debería ser solo desarrolladores)
export const updateCiudad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const ciudad = await Ciudad.findById(id)

        if (!ciudad) {
            return res.status(404).json ({ error: 'Ciudad no encontrada' });
        }

        // Verificar si el nuevo nombre ya existe en otra ciudad
        if (nombre) {
            const ciudadExistente = await Ciudad.findOne({
                nombre: new RegExp(`^${nombre}$`, 'i'),
                _id: { $ne: id } // Excluir la ciudad actual
            });

            if (ciudadExistente){
                return res.status(400).json({ error: 'Ya existe otra ciudad con ese nombre' });
            }
        }

        const ciudadActualizada = await Ciudad.findByIdAndUpdate(
            id,
            { nombre },
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Ciudad actualizada exitosamente',
            ciudad: ciudadActualizada
        });

    }catch (error : any) {
    console.error('Error al actualizar ciudad:', error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: errores.join(', ') });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /api/ciudades/:id - Eliminar una ciudad por ID - (debería ser solo desarrolladores)
export const deleteCiudad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const ciudad = await Ciudad.findById(id);

        if (!ciudad) {
            return res.status(404).json({ error: 'Ciudad no encontrada' });
        }

        // Verificar si hay complejos asociados a la ciudad
        const Complejo = (await import("../models/Complejo")).default;
        const complejosAsociados = await Complejo.find({ ciudad: id });

        if (complejosAsociados.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar la ciudad porque hay complejos asociados a ella', 
            complejosAfectados: complejosAsociados });
        }

        await Ciudad.findByIdAndDelete(id);

        res.json({ message: 'Ciudad eliminada exitosamente' });

    } catch (error) {
        console.error('Error al eliminar ciudad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};