import { Request, Response } from "express";
import Complejo, { SERVICIOS_DISPONIBLES } from "../models/Complejo";
import Usuario from "../models/Usuario";
import Reserva from "../models/Reserva";

export const getComplejos = async (req: Request, res: Response) => {
  try {
    const { nombre, ciudad, tipoCancha, page = "1", limit = "5" } = req.query;

    const query: any = {};

    if (nombre) {
      query.nombre = new RegExp(nombre as string, 'i');
    }


    if (ciudad) {
      if ((ciudad as string).length === 24) {
        query.ciudad = ciudad;
      } else {
        const Ciudad = (await import('../models/Ciudad')).default;
        const ciudadEncontrada = await Ciudad.findOne({
          nombre: new RegExp(ciudad as string, 'i')
        });
        if (ciudadEncontrada) {
          query.ciudad = ciudadEncontrada._id;
        } else {
          return res.json({ complejos: [], total: 0, paginas: 0 });
        }
      }
    }

    if (tipoCancha) {
      query["canchas.tipoCancha"] = tipoCancha;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Ejecutar ambas queries en paralelo
    const [complejos, total] = await Promise.all([
      Complejo.find(query).populate('ciudad', 'nombre').skip(skip).limit(limitNum).exec(),
      Complejo.countDocuments(query)
    ]);

    res.json({
      complejos,
      total,
      pagina: pageNum,
      paginas: Math.ceil(total / limitNum)
    });

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

export const crearComplejo = async (req: Request, res: Response, next: Function) => {
  try {
    const { nombre, direccion, ciudad, servicios, canchas, horarioApertura, horarioCierre } = req.body;

    if (!nombre || !direccion || !ciudad) {
      console.log(req.body)
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Parsear servicios y canchas si vienen como strings (desde FormData)
    let serviciosParsed = servicios;
    let canchasParsed = canchas;

    if (typeof servicios === 'string') {
      try {
        serviciosParsed = JSON.parse(servicios);
      } catch (e) {
        serviciosParsed = [];
      }
    }

    if (typeof canchas === 'string') {
      try {
        canchasParsed = JSON.parse(canchas);
      } catch (e) {
        canchasParsed = [];
      }
    }

    // Obtener la ruta de la imagen si se subió
    const imagen = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;

    const nuevoComplejo = new Complejo({
      nombre,
      direccion,
      ciudad,
      servicios: serviciosParsed || [],
      canchas: canchasParsed || [],
      horarioApertura: horarioApertura || "08:00",
      horarioCierre: horarioCierre || "22:00",
      imagen
    });

    const guardado = await nuevoComplejo.save();
    (req as any).complejoCreado = guardado;

    next();

  } catch (error) {
    console.error("Error al crear complejo:", error);
    res.status(500).json({ error: "Error al crear el complejo" });
  }
};

export const eliminarComplejo = async (req: Request, res: Response): Promise<void> => {
  try {
    const complejoId = req.params.id;
    const userId = (req as any).user.id;
    const complejo = await Complejo.findById(complejoId);

    if (!complejo) {
      res.status(404).json({ error: 'Complejo no encontrado' });
      return;
    }

    //AGREGAR LOGICA PARA VERIFICAR QUE EL USUARIO SEA EL DUEÑO DEL COMPLEJO

    await Usuario.findByIdAndUpdate(
      userId,
      { $pull: { complejos: complejoId } }
    );
    await Complejo.findByIdAndDelete(complejoId);

    res.json({ message: 'Complejo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar complejo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getReservasPorComplejo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fecha } = req.query;

    const complejo = await Complejo.findById(id);
    if (!complejo) {
      res.status(404).json({ error: 'Complejo no encontrado' });
      return;
    }

    // Filtrar por rango del día completo para evitar problemas con horas
    const fechaInicio = new Date(fecha as string);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha as string);
    fechaFin.setHours(23, 59, 59, 999);

    const reservas = await Reserva.find({
      complejo: id,
      fecha: { $gte: fechaInicio, $lte: fechaFin }
    })
      .populate('user', 'nombre apellido telefono')
      .exec();

    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas del complejo' });
  }
};

export const actualizarImagenComplejo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Verificar que se subió una imagen
    if (!(req as any).file) {
      res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
      return;
    }

    // Buscar el complejo
    const complejo = await Complejo.findById(id);
    if (!complejo) {
      res.status(404).json({ error: 'Complejo no encontrado' });
      return;
    }

    // Verificar que el usuario es el propietario
    const usuario = await Usuario.findById(userId);
    if (!usuario || !usuario.complejos.some(complejoId => complejoId.toString() === id)) {
      res.status(403).json({ error: 'No tienes permiso para modificar este complejo' });
      return;
    }

    // Eliminar imagen anterior si existe
    if (complejo.imagen) {
      const fs = require('fs');
      const path = require('path');
      const oldImagePath = path.join(__dirname, '../../', complejo.imagen);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Actualizar con la nueva imagen
    const nuevaImagen = `/uploads/${(req as any).file.filename}`;
    complejo.imagen = nuevaImagen;
    await complejo.save();

    res.json({ message: 'Imagen actualizada correctamente', imagen: nuevaImagen });
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    res.status(500).json({ error: 'Error al actualizar la imagen del complejo' });
  }
};

export const getDisponibilidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const fecha = String(req.query.fecha ?? "");
    const hora = String(req.query.hora ?? "");

    if (!fecha || !hora) {
      res.status(400).json({ error: "Faltan parámetros: fecha y hora" });
      return;
    }

    const complejo = await Complejo.findById(id).exec();
    if (!complejo) {
      res.status(404).json({ error: "Complejo no encontrado" });
      return;
    }

    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    const reservas = await Reserva.find({
      complejo: id,
      fecha: { $gte: fechaInicio, $lte: fechaFin },
      horaInicio: hora,
    }).exec();

    const ocupadas = new Set(reservas.map((r) => r.canchaId));
    const canchasDisponibles = complejo.canchas.reduce<string[]>((acc, cancha) => {
      if (cancha.disponible === false || !cancha._id) {
        return acc;
      }

      const canchaId = cancha._id.toString();
      if (!ocupadas.has(canchaId)) {
        acc.push(canchaId);
      }

      return acc;
    }, []);

    res.status(200).json({ canchasDisponibles });
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};