const PurchaseBill = require("../Models/PurchaseModel");
const Ledger = require("../Models/LedgerModel");
const mongoose = require("mongoose");

exports.getLedgerByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { startDate, endDate } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const query = {
      vendorId: new mongoose.Types.ObjectId(vendorId),
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const ledgers = await Ledger.find(query).sort({ date: 1 }).lean();

    return res.json({
      success: true,
      count: ledgers.length,
      data: ledgers,
    });
  } catch (error) {
    console.error("Error fetching ledger:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching ledger",
    });
  }
};
