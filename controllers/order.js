const { response } = require('express');

const Table = require('../models/table');
const Order = require('../models/order');

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
    const [tables, orders] = await Promise.all([Table.find().lean(), Order.find().populate('product')]);

    for (let i = 0; i < tables.length; i++) {
      let tableId = tables[i]._id;
      let array_pending = orders.filter((order) => {
        return order.table.toString() === tableId.toString() && order.status === 'pending';
      });
      let array_delivered = orders.filter((order) => {
        return order.table.toString() === tableId.toString() && order.status === 'delivered';
      });

      tables[i].pending = array_pending.length;
      tables[i].delivered = array_delivered.length;
    }
    return res.json({ data: tables });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_orders_by_table = async (req, res = response) => {
  const table = req.params['table'];
  try {
    let reg = await Order.find({ table }).populate('product').sort({ created_at: -1, status: 'asc' });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_orders_by_number = async (req, res = response) => {
  const number = req.params['number'];
  try {
    let table = await Table.findOne({ number });
    let orders = await Order.find({ table: table._id }).populate('product').sort({ created_at: -1, status: -1 });
    return res.json({ data: orders, table });
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
