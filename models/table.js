const { Schema, model } = require('mongoose');
const { timestamps } = require('../utils/data');

const TableSchema = Schema(
  {
    number: { type: Number, required: true, unique: true },
    status: { type: Boolean, required: true, default: false },
  },
  timestamps,
);

module.exports = model('Table', TableSchema);
