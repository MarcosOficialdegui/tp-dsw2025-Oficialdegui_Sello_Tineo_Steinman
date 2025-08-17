import { Request, Response } from 'express';
import Cancha from '../models/Cancha';

// Obtener todas las canchas
export const getCanchas = async (req: Request, res: Response) => {
  try {
    const { complejo, tipoCancha, disponible } = req.query;
    
    const query: any = {};
    if (complejo) query.complejo = complejo;
    if (tipoCancha) query.tipoCancha = tipoCancha;
    if (disponible) query.disponible = disponible === 'true';

    const canchas = await Cancha.find(query)
      .populate('tipoCancha')
      .populate('complejo');
    
    res.json(canchas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener canchas' });
  }
};

// Obtener una cancha por ID
export const getCanchaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cancha = await Cancha.findById(id)
      .populate('tipoCancha')
      .populate('complejo');
    
    if (!cancha) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    
    res.json(cancha);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cancha' });
  }
};

// Crear una nueva cancha
export const createCancha = async (req: Request, res: Response) => {
  try {
    const { nombre, tipoCancha, precioHora, complejo, disponible } = req.body;
    
    // Validación básica
    if (!nombre || !tipoCancha || !precioHora || !complejo) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios: nombre, tipo de cancha, precio por hora, complejo' 
      });
    }

    const nuevaCancha = new Cancha({
      nombre,
      tipoCancha,
      precioHora,
      complejo,
      disponible: disponible !== undefined ? disponible : true
    });

    const canchaGuardada = await nuevaCancha.save();
    const canchaCompleta = await Cancha.findById(canchaGuardada._id)
      .populate('tipoCancha')
      .populate('complejo');
    
    res.status(201).json(canchaCompleta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cancha' });
  }
};

// Actualizar una cancha
export const updateCancha = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, tipoCancha, precioHora, complejo, disponible } = req.body;
    
    const canchaActualizada = await Cancha.findByIdAndUpdate(
      id,
      { nombre, tipoCancha, precioHora, complejo, disponible },
      { new: true, runValidators: true }
    )
    .populate('tipoCancha')
    .populate('complejo');
    
    if (!canchaActualizada) {
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    
    res.json(canchaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cancha' });
  }
};

// Eliminar una cancha
export const deleteCancha = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const canchaEliminada = await Cancha.findByIdAndDelete(id);
    
    if (!canchaEliminada) {
      return res.status(404).json({ error: 'Cancha no encontrada.' });
    }
    
    res.json({ message: 'Cancha eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cancha.' });
  }
};
