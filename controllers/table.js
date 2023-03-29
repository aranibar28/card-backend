const { response } = require('express');
const Table = require('../models/table');

const create_table = async (req, res = response) => {
  let data = req.body;
  try {
    let reg = await Table.create(data);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_tables = async (req, res = response) => {
  try {
    let reg = await Table.find().sort({ number: 1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_table_by_number = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await Table.findOne({ number: id });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_table = async (req, res = response) => {
  let id = req.params['id'];
  let data = req.body;
  try {
    let reg = await Table.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_table = async (req, res = response) => {
  let id = req.params['id'];
  try {
    let reg = await Table.findByIdAndDelete(id, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_table,
  read_tables,
  read_table_by_number,
  update_table,
  delete_table,
};
