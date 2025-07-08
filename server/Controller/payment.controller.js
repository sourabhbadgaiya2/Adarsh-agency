const PurchaseBill = require("../Models/PurchaseModel");
const Ledger = require("../Models/Ledger");

exports.adjustPayment = async (req, res) => {
  try {
    console.log(req.body);
    const { vendorId, refType, amount, billIds = [], date } = req.body;

    let remainingAmount = amount;

    if (refType === "adj_ref") {
      for (const billId of billIds) {
        const bill = await PurchaseBill.findById(billId);

        if (!bill || bill.vendorId.toString() !== vendorId) continue;

        const adjustAmt = Math.min(remainingAmount, bill.pendingAmount);
        bill.pendingAmount -= adjustAmt;

        if (bill.pendingAmount === 0) {
          bill.status = "settled";
        }

        await bill.save();

        await Ledger.create({
          vendorId,
          billId: bill._id,
          date,
          refType,
          debit: adjustAmt,
          entryNumber: bill.entryNumber,
          remark: "Adjusted against bill",
        });

        remainingAmount -= adjustAmt;
        if (remainingAmount <= 0) break;
      }
    } else if (refType === "new_ref") {
      await Ledger.create({
        vendorId,
        date,
        refType,
        debit: amount,
        remark: "Payment without bill reference",
      });
    } else if (refType === "clear") {
      const bills = await PurchaseBill.find({ vendorId, status: "pending" });

      for (const bill of bills) {
        const clearAmt = bill.pendingAmount;

        await Ledger.create({
          vendorId,
          billId: bill._id,
          date,
          refType,
          debit: clearAmt,
          entryNumber: bill.entryNumber,
          remark: "Cleared full due",
        });

        bill.pendingAmount = 0;
        bill.status = "settled";
        await bill.save();
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Payment adjusted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getLedgerByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const ledgerEntries = await Ledger.find({ vendorId })
      .sort({ date: 1 }) // Sorted by date ascending
      .lean(); // Faster read-only results

    return res.json({
      success: true,
      count: ledgerEntries.length,
      data: ledgerEntries,
    });
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching ledger",
    });
  }
};
