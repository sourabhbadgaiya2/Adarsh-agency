const express = require("express");
const router = express.Router();
const paymentController = require("../Controller/payment.controller");

router.post("/adjust", paymentController.adjustPayment);

router.get("/ledger/:vendorId", paymentController.getLedgerByVendor);

module.exports = router;
