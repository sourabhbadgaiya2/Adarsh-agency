const mongoose = require("mongoose");

const LedgerSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },

  refType: {
    type: String,
    enum: [
      "invoice",
      "payment",
      "adjustment",
      "clear_ref",
      "invoice_payment",
      "new_ref",
    ],
    required: true,
  },

  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  narration: { type: String },

  debitAccount: {
    type: String,
    // required: true,
  },

  creditAccount: {
    type: String,
    // required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  oldAmount: {
    type: Number,
  },

  newAmount: {
    type: Number,
  },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomerLedger", LedgerSchema);
