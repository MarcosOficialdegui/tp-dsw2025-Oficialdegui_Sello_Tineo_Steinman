import { NextFunction, Request, Response } from "express";
import Reserva from "../models/Reserva";
import {
    fechaISOToUTCMediodia,
    formatearFechaHoraArgentina,
    getDuracionMinutosPorTipoCancha,
    getRangoUTCDeFechaISO,
    seSuperponenIntervalos,
    sumarMinutosAHora,
    validarHora,
} from "../utils/reservaTime";

export const buscarReserva = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { complejo, canchaId, canchaTipo, fecha, horaInicio } = req.body;

        if (!complejo || !canchaId || !canchaTipo || !fecha || !horaInicio) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        if (!validarHora(horaInicio)) {
            return res.status(400).json({ error: "Hora invalida. Formato esperado: HH:mm" });
        }

        const duracionMinutos = getDuracionMinutosPorTipoCancha(canchaTipo);
        const horaFinSolicitada = sumarMinutosAHora(horaInicio, duracionMinutos);
        const { inicio: fechaInicio, fin: fechaFin } = getRangoUTCDeFechaISO(fecha);

        const reservasDelDia = await Reserva.find({
            complejo,
            canchaId,
            fecha: { $gte: fechaInicio, $lte: fechaFin },
        });

        const reservaEncontrada = reservasDelDia.find((reserva) => {
            return seSuperponenIntervalos(horaInicio, horaFinSolicitada, reserva.horaInicio, reserva.horaFin);
        });

        if (reservaEncontrada) {
            return (res.status(400).json({ error: "El horario esta reservado" }))
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

        const { inicio: fechaInicio, fin: fechaFin } = getRangoUTCDeFechaISO(String(fecha));

        const reservas = await Reserva.find({
            canchaId,
            fecha: { $gte: fechaInicio, $lte: fechaFin }
        });

        const horariosOcupados = reservas.map((r) => ({
            horaInicio: r.horaInicio,
            horaFin: r.horaFin,
        }));

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

        if (!validarHora(horaInicio)) {
            return res.status(400).json({ error: "Hora invalida. Formato esperado: HH:mm" });
        }

        const creadoEn = new Date();
        const duracionMinutos = getDuracionMinutosPorTipoCancha(canchaTipo);
        const horaFin = sumarMinutosAHora(horaInicio, duracionMinutos);
        const fechaNormalizada = fechaISOToUTCMediodia(fecha);

        const user = (req as any).user.id;

        if (!user) {
            return res.status(400).json({ error: 'Usuario no autenticado' });
        }


        const nuevaReserva = new Reserva({
            user,
            complejo,
            canchaId,
            canchaTipo,
            fecha: fechaNormalizada,
            horaInicio,
            horaFin,
            duracionMinutos,
            creadoEn
        });

        await nuevaReserva.save();



        console.log(
            "Reserva creada:",
            {
                user,
                complejo,
                canchaId,
                canchaTipo,
                fecha,
                horaInicio,
                horaFin,
                creadoEnAR: formatearFechaHoraArgentina(creadoEn),
            }
        );
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
