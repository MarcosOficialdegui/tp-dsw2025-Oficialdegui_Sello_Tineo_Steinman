import { Request, Response } from "express";
import Complejo from "../models/Complejo";

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
