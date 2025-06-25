// models/Invoice.js

const mongoose = require("mongoose");

const BillingItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference only
  itemName: String,
  unit: String,
  qty: Number,
  Free: Number,
  rate: Number,
  sch: Number,
  schAmt: Number,
  cd: Number,
  cdAmt: Number,
  total: Number,
  gst: Number,
  amount: Number,
});

const InvoiceSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: "Salesman" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // ✅ customer ID

  billingType: {
    type: String,
    enum: ["Cash", "Credit"],
  },

  customer: {
    CustomerName: String,
    Billdate: Date,
    advanceAmt: Number,
    paymentMode: String,

    salesmanName: String, // ✅ add this
    selectedSalesmanId: mongoose.Schema.Types.ObjectId, // ✅ optional, if needed
    selectedCustomerId: mongoose.Schema.Types.ObjectId, // ✅ optional
    selectedBeatId: mongoose.Schema.Types.ObjectId, // ✅ optional
  },
  billing: [BillingItemSchema],
  finalAmount: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);

// // models/Billing.js
// const mongoose = require("mongoose");

// const billingSchema = new mongoose.Schema({
//   companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

//   products: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       unitType: String, // kg or piece
//       quantity: Number,
//       price: Number,
//       total: Number,
//     },
//   ],

//   discounts: {
//     scheme: Number,
//     cashDiscount: Number,
//   },

//   totalAmount: Number,
//   netAmount: Number,

//   salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: "Salesman" },

//   billingDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Billing", billingSchema);
