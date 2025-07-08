const express = require("express");
const router = express.Router();
const purchaseCtrl = require("../Controller/PurchaseCtrl");

router.post("/", purchaseCtrl.createPurchase);
router.get("/", purchaseCtrl.getAllPurchases);
router.get("/next-entry-number", purchaseCtrl.getNextEntryNumber);

// router.post("/bill/minus-amount", purchaseCtrl.minusItemAmount);

router.post("/update-pending-amount", purchaseCtrl.updatePendingAmount);

router.post("/adjust-vendor-direct", purchaseCtrl.adjustNewRef);

router.get("/:id", purchaseCtrl.getPurchaseById);
router.put("/:id", purchaseCtrl.updatePurchase);
router.delete("/:id", purchaseCtrl.deletePurchase);

module.exports = router;
