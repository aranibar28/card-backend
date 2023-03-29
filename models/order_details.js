const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");

const Order_DetailSchema = Schema({
   order:    { type: Schema.Types.ObjectId, ref: "Order", required: true },
   product:  { type: Schema.Types.ObjectId, ref: "Product", required: true },
   price:    { type: Number, required: true },
   quantity: { type: Number, required: true },
}, timestamps);

module.exports = model("Order_Detail", Order_DetailSchema);
