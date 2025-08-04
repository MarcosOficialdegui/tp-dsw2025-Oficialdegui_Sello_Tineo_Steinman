const express = require('express');
const router = express.Router();
const Cancha = require('../models/Cancha');

router.get('/', async (req, res) => {
  const canchas = await Cancha.find()
    .populate('tipoCancha')
    .populate('complejo');
  res.json(canchas);
});

module.exports = router;