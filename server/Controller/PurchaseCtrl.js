const Purchase = require("../Models/PurchaseModel");
const mongoose = require("mongoose");
const Product = require("../Models/ProductModel");

exports.createPurchase = async (req, res) => {
  try {
    // Step 1: Calculate total of all item.totalAmount
    let totalBalance = 0;
    for (const item of req.body.items) {
      totalBalance += parseFloat(item.totalAmount || 0);
    }

    // Step 2: Create new purchase object with balance
    const newPurchase = new Purchase({
      ...req.body, // Spread all existing fields
      pendingAmount: totalBalance, // Override or set balance field
    });

    // Step 3: Save the new purchase
    const savedPurchase = await newPurchase.save();

    // Step 4: Update availableQty for each product
    for (const item of savedPurchase.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      product.availableQty -= Number(item.quantity);
      await product.save();
    }

    res.status(201).json(savedPurchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("vendorId", "name")
      .populate({
        path: "items.productId",
        select: "productName",
      })
      .populate({
        path: "items.companyId",
        select: "name",
      });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("vendorId", "name")
      .populate({
        path: "items.productId",
        select: "productName",
      })
      .populate({
        path: "items.companyId",
        select: "name",
      });
    if (!purchase) return res.status(404).json({ error: "Not found" });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    // Optional: You may want to handle changes in quantities by comparing old and new items
    // For simplicity, here we just update the document directly
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("vendorId", "name")
      .populate({
        path: "items.productId",
        select: "productName",
      })
      .populate({
        path: "items.companyId",
        select: "name",
      });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNextEntryNumber = async (req, res) => {
  try {
    const lastEntry = await Purchase.findOne().sort({ createdAt: -1 });

    let nextEntryNumber = "00001";
    if (lastEntry && lastEntry.entryNumber) {
      const lastNumber = parseInt(lastEntry.entryNumber);
      const nextNumber = lastNumber + 1;
      nextEntryNumber = nextNumber.toString().padStart(5, "0");
    }

    res.json({ nextEntryNumber });
  } catch (err) {
    res.status(500).json({ error: "Failed to get next entry number" });
  }
};

exports.updatePendingAmount = async (req, res) => {
  try {
    console.log(req.body);
    const { vendorId, amount, items } = req.body;

    const purchaseEntry = await Purchase.findById(vendorId);
    if (!purchaseEntry) {
      return res.status(404).json({ message: "Purchase entry not found" });
    }

    let updatedPendingAmount = Number(purchaseEntry.pendingAmount);

    // ✅ If specific items are passed
    if (items && items.length > 0) {
      items.forEach(({ itemId, amount: paidAmount }) => {
        const item = purchaseEntry.items.id(itemId);
        if (item) {
          const itemAmount = Number(item.totalAmount);
          const deduction = Math.min(itemAmount, paidAmount);

          item.totalAmount -= deduction; // update item amount
          updatedPendingAmount -= deduction; // reduce from pendingAmount
        }
      });
    } else {
      // ✅ If no items, deduct from total pendingAmount
      const deduction = Math.min(updatedPendingAmount, amount);
      updatedPendingAmount -= deduction;
    }

    // Ensure no negative amounts
    purchaseEntry.pendingAmount = Math.max(0, updatedPendingAmount);

    await purchaseEntry.save();

    return res.status(200).json({
      message: "Pending amount updated successfully",
      updatedEntry: purchaseEntry,
    });
  } catch (error) {
    console.error("Error updating pending amount:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  "New Ref" Adjustment
exports.adjustNewRef = async (req, res) => {
  console.log(req.body, "KKI");
  const { vendorId, amount } = req.body;

  if (!vendorId || !amount) {
    return res.status(400).json({ message: "Missing vendorId or amount" });
  }

  const purchaseEntries = await Purchase.find({
    vendorId,
    pendingAmount: { $gt: 0 },
  }).sort({ date: 1 });

  let remaining = amount;

  for (const entry of purchaseEntries) {
    if (remaining <= 0) break;

    console.log(entry, "entry");

    const deduct = Math.min(entry.pendingAmount, remaining);
    entry.pendingAmount -= deduct;
    remaining -= deduct;

    await entry.save();
  }

  return res.json({ message: "Vendor balance adjusted", remaining });
};

// controller get balance
// exports.getBalance = async (req, res) => {
//   try {
//     const result = await Purchase.aggregate([
//       {
//         $group: {
//           _id: null,
//           balance: { $sum: { $toDouble: "$pendingAmount" } }, // $toInt agar decimal hai
//         },
//       },
//     ]);

//     const balance = result[0]?.balance || 0;

//     res.status(200).json({ balance });
//   } catch (err) {
//     console.error("Error fetching balance:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getBalanceByVendor = async (req, res) => {
  try {
    console.log(req.params, "get Balance by vendor purchase");

    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const result = await Purchase.aggregate([
      {
        $match: {
          vendorId: new mongoose.Types.ObjectId(vendorId), // ✅ FIXED
        },
      },
      {
        $group: {
          _id: "$vendorId",
          balance: { $sum: { $toDouble: "$pendingAmount" } },
        },
      },
    ]);

    const balance = result[0]?.balance || 0;

    res.status(200).json({ balance });
  } catch (err) {
    console.error("Error fetching vendor balance:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/clear

exports.clearVendorPending = async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const purchases = await Purchase.find({
      vendorId,
      pendingAmount: { $gt: 0 },
    });

    for (const entry of purchases) {
      entry.pendingAmount = 0;
      await entry.save();
    }

    return res.status(200).json({ message: "✅ All pending amounts cleared" });
  } catch (error) {
    console.error("❌ Error clearing vendor balance:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
