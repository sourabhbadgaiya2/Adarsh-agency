const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  purchaseRate: Number,
  quantity: Number,
  availableQty: Number,
  totalAmount: Number,
});

const purchaseSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    items: [itemSchema], // Array of item objects
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
