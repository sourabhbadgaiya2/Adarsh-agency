const express = require("express");
const router = express.Router();
const Ledger = require("../Controller/ledger.controller");

router.get("/:vendorId", Ledger.getLedgerByVendor);

module.exports = router;
