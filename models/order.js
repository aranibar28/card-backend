const { Schema, model } = require('mongoose');
const { timestamps } = require('../utils/data');
const mongoosePaginate = require('mongoose-paginate-v2');

const OrderSchema = Schema(
  {
    table:    { type: Schema.Types.ObjectId, required: true, ref: 'Table' },
    subtotal: { type: Number, required: true, default: 0 },
    status:   { type: String, required: true, default: 'Pendiente' },
    closed:   { type: Boolean, required: true, default: false },
  },
  timestamps,
);

OrderSchema.plugin(mongoosePaginate);
module.exports = model('Order', OrderSchema);
