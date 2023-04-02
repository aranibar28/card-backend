const { response } = require('express');

const Table = require('../models/table');
const Order = require('../models/order');
const Payment = require('../models/payment');

const create_order = async (req, res = response) => {
  const { details, ...data } = req.body;
  try {
    details.forEach(async (item) => {
      for (let i = 0; i < item.quantity; i++) {
        await Order.create({
          table: data.table,
          product: item.product,
        });
      }
    });

    return res.json({ data: details });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_orders = async (req, res = response) => {
  try {
    const [tables, orders, payments] = await Promise.all([
      Table.find().lean(),
      Order.find({ closed: false }).populate('product'),
      Payment.find({ status: 'pending' }).lean(),
    ]);

    for (let i = 0; i < tables.length; i++) {
      let tableId = tables[i]._id;
      let array_pending = orders.filter((order) => {
        return order.table.toString() === tableId.toString() && order.status === 'pending';
      });
      let array_delivered = orders.filter((order) => {
        return order.table.toString() === tableId.toString() && order.status === 'delivered';
      });

      let account = payments.filter((item) => {
        return item.table.toString() === tableId.toString();
      });

      tables[i].pending = array_pending;
      tables[i].delivered = array_delivered;
      tables[i].account = account.length >= 1 ? true : false;
    }
    return res.json({ data: tables });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_orders_by_table = async (req, res = response) => {
  const table = req.params['table'];
  try {
    let reg = await Order.find({ table, closed: false }).populate('product').sort({ created_at: -1, status: 'asc' });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_orders_by_number = async (req, res = response) => {
  const number = req.params['number'];
  try {
    let table = await Table.findOne({ number });

    const [orders, payment] = await Promise.all([
      Order.find({ table: table._id, closed: false }).populate('product').sort({ created_at: -1, status: -1 }),
      Payment.findOne({ table, status: 'pending' }),
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
