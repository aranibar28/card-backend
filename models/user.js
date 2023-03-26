const { Schema, model } = require('mongoose');
const { timestamps } = require('../utils/data');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = Schema(
  {
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    first_name: { type: String, required: false },
    last_name:  { type: String, required: false },
    full_name:  { type: String, required: false },
    dni:        { type: String, required: false },
    phone:      { type: String, required: false },
    genre:      { type: String, required: false },
    image:      { type: Object, required: false, default: {} },
    status:     { type: Boolean, required: false, default: true },
    staff:      { type: Boolean, required: false, default: true },
  },
  timestamps,
);

UserSchema.plugin(mongoosePaginate);
module.exports = model('User', UserSchema);
