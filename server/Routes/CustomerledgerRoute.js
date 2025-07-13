// routes/invoiceRoutes.js
const express = require("express");
const customerLedger = require("../Models/customerLedger");
const router = express.Router();

router.get("/", async (req, res) => {
  const { customerId, startDate, endDate } = req.query;

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID required" });
  }

  const query = { customerId };
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const ledger = await customerLedger.find(query).sort({ date: 1 });
  res.json(ledger);
});

module.exports = router;
