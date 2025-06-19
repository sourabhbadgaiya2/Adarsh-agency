const Product = require("../Models/ProductModel");
const Invoice = require("../Models/BillingModel");

// const createBilling = async (req, res) => {
//   console.log(req.body, "create Billing");

//   try {
//     const {
//       customer,
//       billing,
//       finalAmount,
//       companyId,
//       salesmanId,
//       customerId,
//     } = req.body;

//     // 1. Create Invoice (no transaction)
//     const invoice = new Invoice({
//       companyId,
//       salesmanId,
//       customerId,
//       customer,
//       billing,
//       finalAmount,
//     });

//     await invoice.save();

//     // 2. Deduct stock for each billing item (without session)
//     for (const item of billing) {
//       const totalQtyToDeduct = (item.qty || 0) + (item.Free || 0);

//       const product = await Product.findById(item.productId);

//       if (!product) {
//         throw new Error(`Product not found for ID: ${item.productId}`);
//       }

//       if (product.availableQty < totalQtyToDeduct) {
//         throw new Error(
//           `Insufficient stock for product ${product.productName}. Available: ${product.availableQty}, Required: ${totalQtyToDeduct}`
//         );
//       }

//       product.availableQty -= totalQtyToDeduct;
//       product.lastUpdated = new Date();

//       await product.save(); // save without session
//     }

//     res.status(201).json({ message: "Invoice saved successfully", invoice });
//   } catch (error) {
//     console.error("Error saving invoice:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to save invoice", details: error.message });
//   }
// };

// GET /api/billing

const createBilling = async (req, res) => {
  console.log(req.body, "create Billing");

  try {
    const {
      customer,
      billing,
      finalAmount,
      companyId,
      salesmanId,
      customerId,
    } = req.body;

    // ✅ Clean customer data before saving
    const cleanedCustomer = {
      CustomerName: customer.customerName || "",
      Billdate: new Date(customer.Billdate),
      advanceAmt: Number(customer.advanceAmt || 0),
      paymentMode: customer.paymentMode || "Cash",
    };

    // ✅ Create invoice document
    const invoice = new Invoice({
      companyId,
      salesmanId,
      customerId,
      customer: cleanedCustomer,
      billing,
      finalAmount,
    });

    await invoice.save();

    // ✅ Update stock
    for (const item of billing) {
      const totalQtyToDeduct = (item.qty || 0) + (item.Free || 0);
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product not found for ID: ${item.productId}`);
      }

      if (product.availableQty < totalQtyToDeduct) {
        throw new Error(
          `Insufficient stock for ${product.productName}. Available: ${product.availableQty}, Needed: ${totalQtyToDeduct}`
        );
      }

      product.availableQty -= totalQtyToDeduct;
      product.lastUpdated = new Date();
      await product.save();
    }

    res.status(201).json({ message: "Invoice saved successfully", invoice });
  } catch (error) {
    console.error("Error saving invoice:", error);
    res
      .status(500)
      .json({ error: "Failed to save invoice", details: error.message });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .populate("companyId") // or add fields if you want to limit
      .populate("salesmanId")
      .populate("billing.productId") // ✅ full product details
      .populate("customerId"); // ✅ full customer details
    // console.log(invoices, "invoice");
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

// ✅ DELETE /pro-billing/:id
const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ error: "Failed to delete invoice" });
  }
};
// GET /api/pro-billing/:id
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      // .populate(
      //   "companyId",
      //   "name contactPerson designation city address mobile alternateMobile email whatsapp gstNumber"
      // )
      // .populate(
      //   "salesmanId",
      //   "name designation mobile email city address alternateMobile photo username"
      // )
      // .populate(
      //   "billing.productId",
      //   "productName primaryUnit secondaryUnit primaryPrice secondaryPrice hsnCode gstPercent mrp "
      // )
      // .populate("customerId", "name");
      .populate("companyId")
      .populate("salesmanId")
      .populate("billing.productId") // ✅ full product fields
      .populate("customerId", "firm name mobile address gstNumber"); // ✅ full customer fields

    // ✅ Add this

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

module.exports = {
  createBilling,
  getAllInvoices,
  deleteInvoice, // 👈 export it
  getInvoiceById,
};
