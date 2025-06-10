const express = require("express");
const router = express.Router();
const purchaseCtrl = require("../Controller/PurchaseCtrl");

router.post("/", purchaseCtrl.createPurchase);
router.get("/", purchaseCtrl.getAllPurchases);
router.get("/:id", purchaseCtrl.getPurchaseById);
router.put("/:id", purchaseCtrl.updatePurchase);
router.delete("/:id", purchaseCtrl.deletePurchase);

module.exports = router;
