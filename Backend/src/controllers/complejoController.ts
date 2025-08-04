import { Request, Response } from 'express';
import Complejo from '../models/Complejo';

export const getComplejos = async (req: Request, res: Response) => {
  try {
    const { ciudad, tipo } = req.query;

    const query: any = {};
    if (ciudad) query.ciudad = ciudad;
    if (tipo) query['canchas.tipo'] = tipo;

    const complejos = await Complejo.find(query);
    res.json(complejos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener complejos' });
  }
};
