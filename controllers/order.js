const { response } = require('express');

const Table = require('../models/table');
const Order = require('../models/order');
const Order_Details = require('../models/order_details');

const read_orders = async (req, res = response) => {
  try {
    let orders = await Order.find().lean();

    for (let item of orders) {
      let details = await Order_Details.find({ order: item._id }).populate('product');
      orders.push(details);
    }

    return res.json({ data: orders });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  read_orders,
};
