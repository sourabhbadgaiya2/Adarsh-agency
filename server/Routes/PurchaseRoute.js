// const express = require("express");
// const router = express.Router();
// const purchaseCtrl = require("../Controller/PurchaseCtrl");

// router.post("/", purchaseCtrl.createPurchase);
// router.get("/", purchaseCtrl.getAllPurchases);
// router.get("/next-entry-number", purchaseCtrl.getNextEntryNumber);

// // router.post("/bill/minus-amount", purchaseCtrl.minusItemAmount);

// router.post("/update-pending-amount", purchaseCtrl.updatePendingAmount);

// router.post("/adjust-vendor-direct", purchaseCtrl.adjustNewRef);

// router.get(
//   "/get-ledger-balance/:vendorId",
//   purchaseCtrl.getLedgerBalanceByVendor
// );

// router.get("/get-balance/:vendorId", purchaseCtrl.getBalanceByVendor);

// router.get("/:id", purchaseCtrl.getPurchaseById);
// router.put("/:id", purchaseCtrl.updatePurchase);
// router.delete("/:id", purchaseCtrl.deletePurchase);

// module.exports = router;

const express = require("express");
const router = express.Router();
const purchaseCtrl = require("../Controller/PurchaseCtrl");

// ✅ Create new purchase
router.post("/", purchaseCtrl.createPurchase);

// ✅ Get all purchases
router.get("/", purchaseCtrl.getAllPurchases);

// ✅ Get next entry number
router.get("/next-entry-number", purchaseCtrl.getNextEntryNumber);

// ✅ Adjust vendor payment (new ref)
router.post("/adjust-vendor-direct", purchaseCtrl.adjustNewRef);

// ✅ Clear all vendor dues
router.post("/clear-vendor-pending", purchaseCtrl.clearVendorPending);

// routes/purchaseRoutes.js
router.post("/pay-against-purchase", purchaseCtrl.payAgainstPurchase);

// ✅ Get vendor total balance (pendingAmount sum)
router.get("/get-balance/:vendorId", purchaseCtrl.getBalanceByVendor);

// ✅ Get vendor ledger balance (debit/credit diff)

// ✅ Get purchase by ID
router.get("/:id", purchaseCtrl.getPurchaseById);

// ✅ Update purchase
router.put("/:id", purchaseCtrl.updatePurchase);

// ✅ Delete purchase
router.delete("/:id", purchaseCtrl.deletePurchase);

module.exports = router;
