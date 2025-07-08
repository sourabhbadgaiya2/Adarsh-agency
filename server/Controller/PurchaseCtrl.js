const Purchase = require("../Models/PurchaseModel");
const Product = require("../Models/ProductModel");
const Ledger = require("../Models/Ledger"); // Make sure you import your model

// exports.createPurchase = async (req, res) => {
//   try {
//     const newPurchase = new Purchase(req.body);
//     const savedPurchase = await newPurchase.save();

//     // Update availableQty for each product in items
//     for (const item of savedPurchase.items) {
//       const product = await Product.findById(item.productId);
//       if (!product) continue;
//       product.availableQty -= item.quantity;
//       await product.save();
//     }

//     res.status(201).json(savedPurchase);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

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

// const saveLedger = async (req, res) => {
//   try {
//     const { amount, adjustedAmount, pendingAmount, rows } = req.body;

//     for (const row of rows) {
//       const { billId, amount: rowAmount } = row;

//       if (!billId) continue; // ignore if no ID

//       const bill = await Bill.findById(billId);

//       if (bill) {
//         const adjusted = parseFloat(rowAmount) || 0;
//         bill.pending = Math.max(0, bill.pending - adjusted);
//         bill.status = bill.pending === 0 ? "Settled" : "Partial";

//         await bill.save();
//       }
//     }

//     return res.status(200).json({ message: "Ledger updated successfully." });
//   } catch (error) {
//     console.error("Ledger save error:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

// exports.minusItemAmount = async (req, res) => {
//   try {
//     const { billId, itemId, enteredAmount } = req.body;

//     if (!billId || !itemId || enteredAmount == null) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     // Fetch the bill by billId
//     const bill = await Bill.findById(billId);
//     if (!bill) {
//       return res.status(404).json({ error: "Bill not found." });
//     }

//     // Find the item by itemId in the bill's items array
//     const item = bill.items.find((it) => it._id.toString() === itemId);

//     if (!item) {
//       return res.status(404).json({ error: "Item not found in bill." });
//     }

//     // Convert amounts to numbers (they might be strings)
//     const originalAmount = Number(item.totalAmount);
//     const subtractAmount = Number(enteredAmount);
//     const remainingAmount = originalAmount - subtractAmount;

//     // Optional: Update the amount inside DB
//     item.totalAmount = remainingAmount;
//     await bill.save();

//     // Return updated item or remaining amount
//     res.json({
//       message: "Amount subtracted successfully.",
//       itemId: item._id,
//       originalAmount,
//       enteredAmount: subtractAmount,
//       remainingAmount,
//     });
//   } catch (error) {
//     console.error("Error subtracting amount:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

exports.updatePendingAmount = async (req, res) => {
  try {
    console.log(req.body);
    const { purchaseEntryId, amount, items } = req.body;

    const purchaseEntry = await Purchase.findById(purchaseEntryId);
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

  // 1. Adjust Purchase Entries
  const purchaseEntries = await Purchase.find({
    vendorId,
    pendingAmount: { $gt: 0 },
  }).sort({ date: 1 });

  let remaining = amount;

  for (const entry of purchaseEntries) {
    if (remaining <= 0) break;

    const deduct = Math.min(entry.pendingAmount, remaining);

    console.log(deduct, "deduct");
    const newPending = entry.pendingAmount - deduct;

    entry.pendingAmount = newPending;
    await entry.save(); // ✅ save updated value
    remaining -= deduct;
  }

  // 2. 🧾 Calculate total balance (after adjustment)
  const updatedVendorPurchases = await Purchase.find({ vendorId });
  const totalBalance = updatedVendorPurchases.reduce((sum, p) => {
    return sum + (p.pendingAmount || 0);
  }, 0);

  // 3. 🧾 Create Ledger Entry
  await Ledger.create({
    vendorId,
    billId: null,
    date: new Date(),
    refType: "new_ref",
    debit: amount, // Amount adjusted
    credit: 0, // Or use `remaining` if you need to track leftover
    entryNumber: `LDG-${Date.now()}`,
    remark: `Adjusted ₹${amount.toFixed(2)} | `,
  });

  return res.json({
    message: "Vendor balance adjusted",
    remaining,
    totalBalance,
  });
};
