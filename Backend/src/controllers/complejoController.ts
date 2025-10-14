import { Request, Response } from "express";
import Complejo, { SERVICIOS_DISPONIBLES } from "../models/Complejo";

export const getComplejos = async (req: Request, res: Response) => {
  try {
    const { ciudad, tipoCancha } = req.query;

    const query: any = {};

    if (ciudad) {
      // Si ciudad es un ObjectId, buscar por ID, si no, buscar por nombre
      if (ciudad.length === 24) { // ObjectId tiene 24 caracteres
        query.ciudad = ciudad;
      } else {
        // Buscar ciudades que coincidan con el nombre
        const Ciudad = (await import('../models/Ciudad')).default;
        const ciudadEncontrada = await Ciudad.findOne({ 
          nombre: new RegExp(ciudad as string, 'i') 
        });
        if (ciudadEncontrada) {
          query.ciudad = ciudadEncontrada._id;
        } else {
          // Si no encuentra la ciudad, devolver array vacío
          return res.json([]);
        }
      }
    }

    if (tipoCancha) {
      query["canchas.tipoCancha"] = tipoCancha;
    }

    const complejos = await Complejo.find(query)
      .populate('ciudad', 'nombre') // Populate ciudad con solo el nombre
      .exec();

    res.json(complejos);
  } catch (error) {
    console.error('Error al obtener complejos:', error);
    res.status(500).json({ error: "Error al obtener complejos" });
  }
};

export const getComplejoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Buscar complejo por ID y hacer populate de la ciudad
    const complejo = await Complejo.findById(id)
      .populate('ciudad', 'nombre') // Populate ciudad con solo el nombre
      .exec();
    
    if (!complejo) {
      return res.status(404).json({ error: 'Complejo no encontrado' });
    }
    
    res.json(complejo);
  } catch (error) {
    console.error('Error al obtener complejo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener lista de servicios disponibles
export const getServiciosDisponibles = async (req: Request, res: Response) => {
  try {
    res.json(SERVICIOS_DISPONIBLES);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const crearComplejo = async (req: Request, res: Response) => {
  try {
    const { nombre, direccion, ciudad, servicios, canchas } = req.body;

    if (!nombre || !direccion || !ciudad) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const nuevoComplejo = new Complejo({
      nombre,
      direccion,
      ciudad,
      servicios: servicios || [],
      canchas: canchas || []
    });

    const guardado = await nuevoComplejo.save();
    res.status(201).json({ mensaje: "Complejo creado con éxito", complejo: guardado });

  } catch (error) {
    console.error("Error al crear complejo:", error);
    res.status(500).json({ error: "Error al crear el complejo" });
  }
};

