import { Request, Response } from "express";
import Reserva from "../models/Reserva";
import Complejo from "../models/Complejo";

export const getEstadisticasComplejo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const complejo = await Complejo.findById(id).populate("ciudad", "nombre");
    if (!complejo) {
      res.status(404).json({ error: "Complejo no encontrado" });
      return;
    }

    const todasLasReservas = await Reserva.find({ complejo: id })
      .populate("user", "nombre apellido")
      .sort({ fecha: -1 });

    // ── Ganancias totales ──
    const gananciaTotal = todasLasReservas.reduce((acc, r) => {
      const cancha = complejo.canchas.find(c => c.tipoCancha === r.canchaTipo);
      return acc + (cancha?.precioHora || 0);
    }, 0);

    // ── Reservas últimos 7 días ──
    const hoy = new Date();
    const hace7dias = new Date();
    hace7dias.setDate(hoy.getDate() - 6);

    const reservasPorDia: { fecha: string; reservas: number; ganancias: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dia = new Date();
      dia.setDate(hoy.getDate() - i);
      const diaStr = dia.toISOString().split("T")[0];

      const reservasDelDia = todasLasReservas.filter(r => {
        return new Date(r.fecha).toISOString().split("T")[0] === diaStr;
      });

      const gananciasDelDia = reservasDelDia.reduce((acc, r) => {
        const cancha = complejo.canchas.find(c => c.tipoCancha === r.canchaTipo);
        return acc + (cancha?.precioHora || 0);
      }, 0);

      reservasPorDia.push({
        fecha: dia.toLocaleDateString("es-AR", { weekday: "short", day: "numeric" }),
        reservas: reservasDelDia.length,
        ganancias: gananciasDelDia,
      });
    }

    // ── Cancha más reservada ──
    const conteoPorCancha: Record<string, number> = {};
    todasLasReservas.forEach(r => {
      conteoPorCancha[r.canchaTipo] = (conteoPorCancha[r.canchaTipo] || 0) + 1;
    });
    const canchasMasReservadas = Object.entries(conteoPorCancha)
      .map(([tipo, cantidad]) => ({ tipo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // ── Hora pico ──
    const conteoPorHora: Record<string, number> = {};
    todasLasReservas.forEach(r => {
      conteoPorHora[r.horaInicio] = (conteoPorHora[r.horaInicio] || 0) + 1;
    });
    const horasPico = Object.entries(conteoPorHora)
      .map(([hora, cantidad]) => ({ hora, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // ── Reservas del mes actual ──
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const reservasMesActual = todasLasReservas.filter(r => new Date(r.fecha) >= inicioMes);
    const gananciasMesActual = reservasMesActual.reduce((acc, r) => {
      const cancha = complejo.canchas.find(c => c.tipoCancha === r.canchaTipo);
      return acc + (cancha?.precioHora || 0);
    }, 0);

    // ── Próximas reservas ──
    const proximasReservas = todasLasReservas
      .filter(r => new Date(r.fecha) >= hoy)
      .slice(0, 5);

    res.json({
      complejo: {
        nombre: complejo.nombre,
        totalCanchas: complejo.canchas.length,
      },
      resumen: {
        totalReservas: todasLasReservas.length,
        gananciaTotal,
        reservasMesActual: reservasMesActual.length,
        gananciasMesActual,
      },
      graficos: {
        reservasPorDia,
        canchasMasReservadas,
        horasPico,
      },
      proximasReservas: proximasReservas.map(r => ({
        _id: r._id,
        canchaTipo: r.canchaTipo,
        fecha: r.fecha,
        horaInicio: r.horaInicio,
        usuario: (r.user as any)?.nombre + " " + (r.user as any)?.apellido,
      })),
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getMisComplejosDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const Usuario = (await import("../models/Usuario")).default;

    const usuario = await Usuario.findById(userId).populate("complejos");
    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ complejos: usuario.complejos });
  } catch (error) {
    console.error("Error al obtener complejos del dashboard:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};