const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firm: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      // required: true,
      // unique: true,
    },
    alternateMobile: {
      type: Number,
      // required: true,
    },
    email: {
      type: String,
      lowercase: true,
      // required: true,
    },
    whatsapp: {
      type: Number,
      // required: true,
    },
    designation: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    address: {
      type: String,
      // required: true,
    },
    creditLimit: {
      type: Number,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    creditDay: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
