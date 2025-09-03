import { Request, Response } from "express";
import Complejo from "../models/Complejo";

export const getComplejos = async (req: Request, res: Response): Promise<void> => {
  try {
    const complejos = await Complejo.find().populate("canchas");
    res.json(complejos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener complejos" });
  }
};
