const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    vendorId: mongoose.Schema.Types.ObjectId,
    billId: { type: mongoose.Schema.Types.ObjectId, default: null },
    date: Date,
    refType: String, // adj_ref, new_ref, clear
    debit: Number, // amount paid
    credit: Number, // if needed later
    entryNumber: String,
    remark: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ledger", ledgerSchema);
