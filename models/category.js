const { Schema, model } = require('mongoose');
const { timestamps } = require('../utils/data');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image:       { type: Object, required: false, default: {} },
    status:      { type: Boolean, required: true, default: false },
  },
  timestamps,
);

CategorySchema.plugin(mongoosePaginate);
module.exports = model('Category', CategorySchema);
