const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  date: Date,
  completed: { type: Boolean, default: false }
});

const OrderSchema = new mongoose.Schema(
  {
    serialNo: Number,
    phone: String,
    price: Number,
    endDate: Date,
    cancelled: { type: Boolean, default: false },
    tasks: {
      cutting: TaskSchema,
      stitching: TaskSchema,
      fitCheck: TaskSchema,
      tirpai: TaskSchema,
      ready: TaskSchema
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
