import { NextFunction, Request, Response } from "express";
import Reserva from "../models/Reserva";

export const buscarReserva = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { complejo, canchaId, fecha, horaInicio } = req.body;
        const reservaEncontrada = await Reserva.findOne({complejo, canchaId, fecha, horaInicio})
        console.log(reservaEncontrada)
        if(reservaEncontrada){
            return(res.status(400).json({error: "El horario esta reservado"}))
        }
        next();
    } catch (error) {
        console.error('Error al buscar reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const cancelarReserva = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        // Que solo el dueño de la reserva pueda cancelarla
        if (reserva.user.toString() !== userId) {
            return res.status(403).json({ error: 'No tenés permiso para cancelar esta reserva' });
        }

        await Reserva.findByIdAndDelete(id);
        res.status(200).json({ message: 'Reserva cancelada correctamente' });

    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerHorariosOcupados = async (req: Request, res: Response) => {
    try {
        const { canchaId, fecha } = req.query;

        if (!canchaId || !fecha) {
            return res.status(400).json({ error: 'Faltan parámetros' });
        }

        // Busca todas las reservas para esa cancha y fecha
        const fechaInicio = new Date(fecha as string);
        const fechaFin = new Date(fecha as string);
        fechaFin.setDate(fechaFin.getDate() + 1);

        const reservas = await Reserva.find({
            canchaId,
            fecha: { $gte: fechaInicio, $lt: fechaFin }
        });

        const horariosOcupados = reservas.map(r => r.horaInicio);
        res.status(200).json({ horariosOcupados });

    } catch (error) {
        console.error('Error al obtener horarios ocupados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const crearReserva = async (req: Request, res: Response) => {

    try {
        const { complejo, canchaId, canchaTipo, fecha, horaInicio } = req.body;

        if (!complejo || !canchaId || !canchaTipo || !fecha || !horaInicio) {
            console.log('Datos: ', complejo, canchaId, canchaTipo, fecha, horaInicio)
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        const creadoEn = new Date();

        const user = (req as any).user.id;

        if (!user) {
            return res.status(400).json({ error: 'Usuario no autenticado' });
        }


        const nuevaReserva = new Reserva({
            user,
            complejo,
            canchaId,
            canchaTipo,
            fecha,
            horaInicio,
            creadoEn
        });

        await nuevaReserva.save();



        console.log(user, complejo, canchaId, canchaTipo, fecha, horaInicio, creadoEn);
        res.status(201).json({ message: 'Reserva creada exitosamente' });



    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

};


export const obtenerReservasPorUsuario = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const reservas = await Reserva.find({ user: userId });
        res.status(200).json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
