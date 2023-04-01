const { response } = require('express');

const Payment = require('../models/payment');
const Order = require('../models/order');

const create_payment = async (req, res = response) => {
  const data = req.body;
  try {
    const payment = await Payment.create(data);

    await Order.updateMany({ table: payment.table, closed: false }, { payment: payment._id });

    return res.json({ data: payment });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_payment_by_table = async (req, res = response) => {
  const table = req.params['table'];
  try {
    let reg = await Payment.find({ table, status: 'pending' });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const close_payment = async (req, res = response) => {
  const id = req.params['id'];
  try {
    const payment = await Payment.findByIdAndUpdate(id, { status: 'paid' });
    await Order.updateMany({ table: payment.table, closed: false }, { closed: true });

    return res.json({ data: payment });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_payment,
  read_payment_by_table,
  close_payment,
};
