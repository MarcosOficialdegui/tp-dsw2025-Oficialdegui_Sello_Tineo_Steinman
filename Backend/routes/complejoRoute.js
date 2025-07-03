const express = require('express');
const router = express.Router();
const Complejo = require('../models/Complejo');

router.get('/', async (req, res) => {
  try {
    const complejos = await Complejo.find();
    res.json(complejos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener complejos' });
  }
});

module.exports = router;
