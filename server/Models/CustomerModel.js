const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    ledger: {
      type: String,
      // required: true,
    },
    name: {
      type: String,
      // required: true,
    },
    address1: {
      type: String,
      // required: true,
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
    // beats: [
    //   {
    //     type: String,
    //     // required: true,
    //   },
    // ],
    area: {
      type: String,
      required: true,
    },
    beat: [
      {
        areaName: {
          type: String,
          // required: true,
        },
      },
    ],

    city: {
      type: String,
      // required: true,
    },
    bill: {
      type: String,
      // required: true,
    },

    billingType: { type: String, enum: ["Credit", "Cash"] },

    creditLimit: {
      type: Number,
      // required: true,
    },
    balance: {
      type: Number,
      // required: true,
    },
    gstNumber: {
      type: String,
      // required: true,
    },
    creditDay: {
      type: Date,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
