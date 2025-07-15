// const Purchase = require("../Models/PurchaseModel");
// const mongoose = require("mongoose");
// const Product = require("../Models/ProductModel");
// const Ledger = require("../Models/LedgerModel");

// exports.createPurchase = async (req, res) => {
//   try {
//     // Step 1: Calculate total of all item.totalAmount
//     let totalBalance = 0;
//     for (const item of req.body.items) {
//       totalBalance += parseFloat(item.totalAmount || 0);
//     }

//     // Step 2: Create new purchase object with balance
//     const newPurchase = new Purchase({
//       ...req.body, // Spread all existing fields
//       pendingAmount: totalBalance, // Override or set balance field
//     });

//     // Step 3: Save the new purchase
//     const savedPurchase = await newPurchase.save();

//     // Ledger Entry — CREDIT मतलब supplier से माल खरीदा
//     await Ledger.create({
//       vendorId: savedPurchase.vendorId,
//       purchaseId: savedPurchase._id,
//       type: "CREDIT",
//       amount: totalBalance,
//       note: "New Purchase",
//     });

//     // Step 4: Update availableQty for each product
//     for (const item of savedPurchase.items) {
//       const product = await Product.findById(item.productId);
//       if (!product) continue;
//       product.availableQty -= Number(item.quantity);
//       await product.save();
//     }

//     res.status(201).json(savedPurchase);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.getAllPurchases = async (req, res) => {
//   try {
//     const purchases = await Purchase.find()
//       .populate("vendorId", "name")
//       .populate({
//         path: "items.productId",
//         select: "productName",
//       })
//       .populate({
//         path: "items.companyId",
//         select: "name",
//       });
//     res.json(purchases);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getPurchaseById = async (req, res) => {
//   try {
//     const purchase = await Purchase.findById(req.params.id)
//       .populate("vendorId", "name")
//       .populate({
//         path: "items.productId",
//         select: "productName",
//       })
//       .populate({
//         path: "items.companyId",
//         select: "name",
//       });
//     if (!purchase) return res.status(404).json({ error: "Not found" });
//     res.json(purchase);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updatePurchase = async (req, res) => {
//   try {
//     // Optional: You may want to handle changes in quantities by comparing old and new items
//     // For simplicity, here we just update the document directly
//     const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     })
//       .populate("vendorId", "name")
//       .populate({
//         path: "items.productId",
//         select: "productName",
//       })
//       .populate({
//         path: "items.companyId",
//         select: "name",
//       });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deletePurchase = async (req, res) => {
//   try {
//     await Purchase.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getNextEntryNumber = async (req, res) => {
//   try {
//     const lastEntry = await Purchase.findOne().sort({ createdAt: -1 });

//     let nextEntryNumber = "00001";
//     if (lastEntry && lastEntry.entryNumber) {
//       const lastNumber = parseInt(lastEntry.entryNumber);
//       const nextNumber = lastNumber + 1;
//       nextEntryNumber = nextNumber.toString().padStart(5, "0");
//     }

//     res.json({ nextEntryNumber });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to get next entry number" });
//   }
// };

// exports.updatePendingAmount = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { vendorId, amount, items } = req.body;

//     const purchaseEntry = await Purchase.findById(vendorId);
//     if (!purchaseEntry) {
//       return res.status(404).json({ message: "Purchase entry not found" });
//     }

//     let updatedPendingAmount = Number(purchaseEntry.pendingAmount);

//     // ✅ If specific items are passed
//     if (items && items.length > 0) {
//       items.forEach(({ itemId, amount: paidAmount }) => {
//         const item = purchaseEntry.items.id(itemId);
//         if (item) {
//           const itemAmount = Number(item.totalAmount);
//           const deduction = Math.min(itemAmount, paidAmount);

//           item.totalAmount -= deduction; // update item amount
//           updatedPendingAmount -= deduction; // reduce from pendingAmount
//         }
//       });
//     } else {
//       // ✅ If no items, deduct from total pendingAmount
//       const deduction = Math.min(updatedPendingAmount, amount);
//       updatedPendingAmount -= deduction;
//     }

//     // Ensure no negative amounts
//     purchaseEntry.pendingAmount = Math.max(0, updatedPendingAmount);

//     await purchaseEntry.save();

//     return res.status(200).json({
//       message: "Pending amount updated successfully",
//       updatedEntry: purchaseEntry,
//     });
//   } catch (error) {
//     console.error("Error updating pending amount:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// //  "New Ref" Adjustment
// exports.adjustNewRef = async (req, res) => {
//   console.log(req.body, "KKI");
//   const { vendorId, amount } = req.body;

//   if (!vendorId || !amount) {
//     return res.status(400).json({ message: "Missing vendorId or amount" });
//   }

//   const purchaseEntries = await Purchase.find({
//     vendorId,
//     pendingAmount: { $gt: 0 },
//   }).sort({ date: 1 });

//   let remaining = amount;

//   for (const entry of purchaseEntries) {
//     if (remaining <= 0) break;

//     console.log(entry, "entry");

//     const deduct = Math.min(entry.pendingAmount, remaining);
//     entry.pendingAmount -= deduct;
//     remaining -= deduct;

//     await entry.save();
//   }

//   return res.json({ message: "Vendor balance adjusted", remaining });
// };

// exports.getBalanceByVendor = async (req, res) => {
//   try {
//     console.log(req.params, "get Balance by vendor purchase");

//     const { vendorId } = req.params;

//     if (!vendorId) {
//       return res.status(400).json({ message: "Vendor ID is required" });
//     }

//     const result = await Purchase.aggregate([
//       {
//         $match: {
//           vendorId: new mongoose.Types.ObjectId(vendorId), // ✅ FIXED
//         },
//       },
//       {
//         $group: {
//           _id: "$vendorId",
//           balance: { $sum: { $toDouble: "$pendingAmount" } },
//         },
//       },
//     ]);

//     const balance = result[0]?.balance || 0;

//     res.status(200).json({ balance });
//   } catch (err) {
//     console.error("Error fetching vendor balance:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // controllers/clear

// exports.clearVendorPending = async (req, res) => {
//   try {
//     const { vendorId } = req.body;

//     if (!vendorId) {
//       return res.status(400).json({ message: "Vendor ID is required" });
//     }

//     const purchases = await Purchase.find({
//       vendorId,
//       pendingAmount: { $gt: 0 },
//     });

//     for (const entry of purchases) {
//       entry.pendingAmount = 0;
//       await entry.save();
//     }

//     return res.status(200).json({ message: "✅ All pending amounts cleared" });
//   } catch (error) {
//     console.error("❌ Error clearing vendor balance:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getLedgerBalanceByVendor = async (req, res) => {
//   try {
//     const { vendorId } = req.params;

//     const result = await Ledger.aggregate([
//       { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
//       {
//         $group: {
//           _id: null,
//           credit: {
//             $sum: {
//               $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
//             },
//           },
//           debit: {
//             $sum: {
//               $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
//             },
//           },
//         },
//       },
//     ]);

//     const balance = result.length > 0 ? result[0].credit - result[0].debit : 0;

//     res.json({ balance });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching ledger balance" });
//   }
// };

const mongoose = require("mongoose");
const Purchase = require("../Models/PurchaseModel");
const Product = require("../Models/ProductModel");
const Ledger = require("../Models/LedgerModel");

// ✅ Create New Purchase Entry
exports.createPurchase = async (req, res) => {
  try {
    let totalAmount = 0;

    // Calculate total final amount
    req.body.items.forEach((item) => {
      totalAmount += parseFloat(item.totalAmount || 0);
    });

    const newPurchase = new Purchase({
      ...req.body,
      finalAmount: totalAmount,
      pendingAmount: totalAmount, // initially full amount due
    });

    const savedPurchase = await newPurchase.save();

    // ✅ Ledger Entry: CREDIT => Vendor ko paisa dena hai

    const ledger = await Ledger.create({
      vendorId: savedPurchase.vendorId,
      refId: savedPurchase._id, // ✅ Correct field name
      refType: "invoice",
      type: "CREDIT",
      amount: totalAmount,
      debitAccount: "Inventory", // ✅ Logical debit side
      creditAccount: "Accounts Payable", // ✅ Logical credit side
      narration: `New Purchase created`,
    });

    // Link ledgerId to purchase
    savedPurchase.ledgerIds.push(ledger._id);
    await savedPurchase.save();

    // ✅ Update Product stock
    for (const item of savedPurchase.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.availableQty -= Number(item.quantity);
        await product.save();
      }
    }

    res.status(201).json(savedPurchase);
  } catch (err) {
    console.error("Error creating purchase:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get All Purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("vendorId", "firm name")
      .populate("ledgerIds")
      .populate("items.productId", "productName");
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Purchase By ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("vendorId", "firm name")
      .populate("ledgerIds")
      .populate("items.productId", "productName");
    if (!purchase) return res.status(404).json({ message: "Not found" });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Purchase
exports.updatePurchase = async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("vendorId", "firm name")
      .populate("ledgerIds")
      .populate("items.productId", "productName");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Purchase
exports.deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Next Entry Number
exports.getNextEntryNumber = async (req, res) => {
  try {
    const lastEntry = await Purchase.findOne().sort({ createdAt: -1 });
    let nextEntryNumber = "00001";
    if (lastEntry && lastEntry.entryNumber) {
      const lastNumber = parseInt(lastEntry.entryNumber);
      nextEntryNumber = (lastNumber + 1).toString().padStart(5, "0");
    }
    res.json({ nextEntryNumber });
  } catch (err) {
    res.status(500).json({ message: "Failed to get next entry number" });
  }
};

// ✅ Apply Payment (New Ref) — adjust pending + create DEBIT ledger
exports.adjustNewRef = async (req, res) => {
  try {
    const { vendorId, amount } = req.body;

    if (!vendorId || !amount) {
      return res.status(400).json({ message: "Vendor ID & amount required" });
    }

    let remaining = amount;

    const purchaseEntries = await Purchase.find({
      vendorId,
      pendingAmount: { $gt: 0 },
    }).sort({ date: 1 });

    for (const entry of purchaseEntries) {
      if (remaining <= 0) break;

      const deduct = Math.min(entry.pendingAmount, remaining);

      await Ledger.create({
        vendorId: vendorId,
        refId: entry._id,
        refType: "payment",
        type: "DEBIT",
        amount: deduct,
        debitAccount: "Accounts Payable",
        creditAccount: "Cash",
        narration: `Payment adjusted for purchase #${entry._id}`,
      });

      entry.pendingAmount -= deduct;
      entry.status = entry.pendingAmount === 0 ? "cleared" : "partial";
      remaining -= deduct;

      await entry.save();
    }

    res.json({
      message: "Vendor payment adjusted",
      totalAdjusted: amount - remaining,
      remaining: remaining,
    });
  } catch (err) {
    console.error("Error adjusting vendor payment:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Clear all Vendor Pending Amounts
exports.clearVendorPending = async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID required" });
    }

    const purchases = await Purchase.find({
      vendorId,
      pendingAmount: { $gt: 0 },
    });

    for (const entry of purchases) {
      // ✅ Clear pending & mark status
      entry.pendingAmount = 0;
      entry.status = "cleared";

      await Ledger.create({
        vendorId: vendorId,
        purchaseId: entry._id,
        refType: "clear_ref",
        type: "DEBIT",
        amount: entry.pendingAmount,
        note: "All dues cleared",
      });

      await entry.save();
    }

    res.json({ message: "All pending cleared for vendor" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Vendor Total Purchase Balance
exports.getBalanceByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const result = await Purchase.aggregate([
      {
        $match: {
          vendorId: new mongoose.Types.ObjectId(vendorId),
        },
      },
      {
        $group: {
          _id: "$vendorId",
          balance: { $sum: "$pendingAmount" },
        },
      },
    ]);

    const balance = result[0]?.balance || 0;

    res.json({ balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Pay against selected Purchase bill
exports.payAgainstPurchase = async (req, res) => {
  try {
    const { purchaseId, amount } = req.body;

    if (!purchaseId || !amount) {
      return res
        .status(400)
        .json({ message: "Purchase ID & amount are required" });
    }

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const vendorId = purchase.vendorId;

    const deduction = Math.min(purchase.pendingAmount, amount);

    // ✅ Ledger entry for this payment with all required fields
    const ledger = await Ledger.create({
      vendorId: vendorId,
      refId: purchase._id, // ✅ Must for linking
      refType: "adj_ref",
      debitAccount: "Cash", // Tumhare system ke hisab se Cash ya Bank
      creditAccount: "Vendor", // Vendor side
      debit: deduction,
      credit: 0,
      narration: `Payment received against selected Purchase`,
    });

    // ✅ Update purchase pending amount & status
    purchase.pendingAmount -= deduction;
    purchase.status = purchase.pendingAmount === 0 ? "cleared" : "partial";
    purchase.ledgerIds.push(ledger._id);

    await purchase.save();

    return res.status(200).json({
      message: "Payment adjusted for selected Purchase",
      paidAmount: deduction,
      updatedPurchase: purchase,
    });
  } catch (err) {
    console.error("Error paying against purchase:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
