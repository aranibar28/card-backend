const { Schema, model } = require('mongoose');
const { timestamps } = require('../utils/data');

const PaymentSchema = Schema(
  {
    table:  { type: Schema.Types.ObjectId, required: true, ref: 'Table' },
    type:   { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    amount: { type: Number, required: true, default: 0 },
  },
  timestamps,
);

module.exports = model('Payment', PaymentSchema);
