const { response } = require('express');

const Payment = require('../models/payment');

const create_payment = async (req, res = response) => {
  const data = req.body;
  try {
    const reg = await Payment.create(data);

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_payment,
};
