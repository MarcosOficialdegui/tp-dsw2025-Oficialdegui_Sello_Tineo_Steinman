import { Request, Response } from "express";
import Reserva from "../models/Reserva";



export const crearReserva = async (req: Request, res: Response) => {
    try {
       const { complejo, cancha, fecha, horaInicio } = req.body;


        if (!complejo || !cancha || !fecha || !horaInicio) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        const creadoEn = new Date();

        const user = (req as any).user.id;

        if(!user){
            return res.status(400).json({ error: 'Usuario no autenticado' });
        }


        const nuevaReserva = new Reserva({
               user,
               complejo,
               cancha,
               fecha,
               horaInicio,
               creadoEn
           });
   
        await nuevaReserva.save();
   
         

        console.log(user, complejo, cancha, fecha, horaInicio, creadoEn);
        res.status(201).json({ message: 'Reserva creada exitosamente' });



    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

};
