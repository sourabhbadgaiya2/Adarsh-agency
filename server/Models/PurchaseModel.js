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

  // Extra fields based on payload
  purchaseDate: Date,
});

const purchaseSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    // Extra fields from payload
    date: {
      type: Date,
      required: true,
    },
    entryNumber: {
      type: String,
      unique: true,
      required: true,
    },
    partyNo: {
      type: String,
      required: true,
    },
    adjustedAmount: {
      type: String,
    },
    pendingAmount: {
      type: String,
    },

    items: [itemSchema], // Array of item objects
  },
  { timestamps: true }
);

purchaseSchema.pre("save", async function (next) {
  if (!this.entryNumber) {
    try {
      const lastEntry = await Purchase.findOne().sort({ createdAt: -1 });

      let newEntryNumber = "00001";
      if (lastEntry && lastEntry.entryNumber) {
        const lastNumber = parseInt(lastEntry.entryNumber);
        const nextNumber = lastNumber + 1;
        newEntryNumber = nextNumber.toString().padStart(5, "0");
      }

      this.entryNumber = newEntryNumber;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Purchase", purchaseSchema);
