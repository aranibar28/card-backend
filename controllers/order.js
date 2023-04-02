const { response } = require('express');

const Table = require('../models/table');
const Order = require('../models/order');
const Payment = require('../models/payment');

const create_order = async (req, res = response) => {
  const { details, ...data } = req.body;
  try {
    const orders = details.reduce((acc, ccr) => {
      return acc + ccr.quantity;
    }, 0);

    details.forEach(async (item) => {
      for (let i = 0; i < item.quantity; i++) {
        await Order.create({
          table: data.table,
          product: item.product,
        });
      }
    });

    const reg = {
      table: data.table,
      orders,
    };

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_orders = async (req, res = response) => {
  try {
    const [tables, orders, payments] = await Promise.all([
      Table.find().lean(),
      Order.find({ closed: false }).lean(),
      Payment.find({ status: 'pending' }).lean(),
    ]);

    for (let i = 0; i < tables.length; i++) {
      let tableId = tables[i]._id.toString();

      let array_pending = orders.filter((item) => {
        return item.table.toString() === tableId && item.status === 'pending';
      });

      let array_delivered = orders.filter((item) => {
        return item.table.toString() === tableId && item.status === 'delivered';
      });

      let account = payments.some((item) => item.table.toString() === tableId);

      tables[i].pending = array_pending.length;
      tables[i].delivered = array_delivered.length;
      tables[i].account = account;
    }
    return res.json({ data: tables });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_orders_by_table = async (req, res = response) => {
  const table = req.params['table'];
  try {
    const [orders, payment] = await Promise.all([
      Order.find({ table, closed: false }).populate('product').sort({ created_at: -1 }),
      Payment.findOne({ table, status: 'pending' }).lean(),
    ]);

    return res.json({ data: orders, payment });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};
/*
const read_orders_by_number = async (req, res = response) => {
  const number = req.params['number'];
  try {
    const [table] = await Table.find({ number }).select('_id');

    const data = await Order.aggregate([
      { $match: { table: table._id, closed: false } },
      { $sort: { created_at: -1, status: -1 } },
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { _id: 0, product: 1, created_at: 1, status: 1 } },
    ]);

    const payment = await Payment.findOne({ table: table._id, status: 'pending' });

    return res.json({ data, payment, table });
  } catch (error) {
    return res.json({ msg: error.message });
  }
}; */

const read_orders_by_number = async (req, res = response) => {
  const number = req.params['number'];
  try {
    let table = await Table.findOne({ number });

    const [orders, payment] = await Promise.all([
      Order.find({ table: table._id, closed: false }).populate('product').sort({ created_at: -1, status: -1 }),
      Payment.findOne({ table: table._id, status: 'pending' }),
    ]);

    return res.json({ data: orders, payment, table });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_order = async (req, res = response) => {
  const id = req.params['id'];
  const data = req.body;
  try {
    const reg = await Order.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_order,
  read_orders,
  read_orders_by_table,
  read_orders_by_number,
  update_order,
};
