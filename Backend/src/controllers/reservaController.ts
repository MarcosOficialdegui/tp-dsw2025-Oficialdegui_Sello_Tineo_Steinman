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
