import { Request, Response } from "express";
import Complejo, { SERVICIOS_DISPONIBLES } from "../models/Complejo";

export const getComplejos = async (req: Request, res: Response) => {
  try {
    const { ciudad, tipoCancha } = req.query;

    const query: any = {};

    if (ciudad) {
      query.ciudad = ciudad; 
    }

    if (tipoCancha) {
      query["canchas.tipoCancha"] = tipoCancha;
    }

    const complejos = await Complejo.find(query).populate("canchas");

    res.json(complejos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener complejos" });
  }
};

export const getComplejoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Buscar complejo por ID sin populate ya que los datos están embebidos
    const complejo = await Complejo.findById(id);
    
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

