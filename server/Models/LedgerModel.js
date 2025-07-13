// const mongoose = require("mongoose");

// const LedgerSchema = new mongoose.Schema({
//   vendorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Vendor",
//     required: false, // ✅ Optional
//   },

//   purchaseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Purchase",
//   },
//   refType: {
//     type: String,
//     enum: ["invoice", "payment", "adjustment", "clear_ref", "invoice_payment"],
//     required: true,
//   },

//   type: {
//     type: String,
//     enum: ["CREDIT", "DEBIT"],
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   note: {
//     type: String,
//   },
// });

// module.exports = mongoose.model("Ledger", LedgerSchema);

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
      "purchase",
      "purchase_payment",
      "adj_ref",
    ],
    required: true,
  },

  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  narration: String,

  debitAccount: {
    type: String,
    required: true,
  },

  creditAccount: {
    type: String,
    required: true,
  },

  debit: {
    type: Number,
    default: 0,
  },

  credit: {
    type: Number,
    default: 0,
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ledger", LedgerSchema);
