const Purchase = require("../Models/PurchaseModel");
const Product = require("../Models/ProductModel");

exports.createPurchase = async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    const savedPurchase = await newPurchase.save();

    // Update availableQty for each product in items
    for (const item of savedPurchase.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      product.availableQty += item.quantity;
      await product.save();
    }

    res.status(201).json(savedPurchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("vendorId", "name")
      .populate({
        path: "items.productId",
        select: "productName",
      })
      .populate({
        path: "items.companyId",
        select: "name",
      });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("vendorId", "name")
      .populate({
        path: "items.productId",
        select: "productName",
      })
      .populate({
        path: "items.companyId",
        select: "name",
      });
    if (!purchase) return res.status(404).json({ error: "Not found" });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    // Optional: You may want to handle changes in quantities by comparing old and new items
    // For simplicity, here we just update the document directly
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("vendorId", "name")
      .populate({
        path: "items.productId",
        select: "productName",
      })
      .populate({
        path: "items.companyId",
        select: "name",
      });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
