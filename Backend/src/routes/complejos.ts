import express from 'express';
import Complejo from '../models/Complejo';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const nuevo = new Complejo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear complejo', details: err });
  }
});

router.get('/', async (req, res) => {
  try {
    const { ciudad, tipoCancha } = req.query;

    const filtros: any = {};
    if (ciudad) filtros.ciudad = ciudad;
    if (tipoCancha) filtros.canchas = { $elemMatch: { tipo: tipoCancha } };

    const complejos = await Complejo.find(filtros);
    res.json(complejos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener complejos', details: err });
  }
});

export default router;
