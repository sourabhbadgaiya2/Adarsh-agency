const express = require("express");
const router = express.Router();
const BillingCtrl = require("../Controller/ProductBillingCtrl");

router.post("/", BillingCtrl.createBilling);
router.get("/", BillingCtrl.getAllInvoices);

router.get("/balance/customer/:customerId", BillingCtrl.getBalanceByCustomer);

router.get("/customer/:customerIdOrName", BillingCtrl.getInvoicesByCustomer);

router.delete("/:id", BillingCtrl.deleteInvoice);
router.get("/:id", BillingCtrl.getInvoiceById);

module.exports = router;
