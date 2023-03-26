const { Schema, model } = require('mongoose');
const { timestamps } = require('../utils/data');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stock:       { type: Number, required: false, default: 0 },
    price:       { type: Number, required: false, default: 0 },
    image:       { type: Object, required: false, default: {} },
    status:      { type: Boolean, required: true, default: false },
    category:    { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
  },
  timestamps,
);

ProductSchema.plugin(mongoosePaginate);
module.exports = model('Product', ProductSchema);
