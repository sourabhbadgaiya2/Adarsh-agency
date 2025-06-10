const Vendor = require("../Models/VendorModel");
const createVendor = async (req, res) => {
  const newVendor = new Vendor(req.body);
  await newVendor.save();
  res.status(201).json(newVendor);
};
const getallVendors = async (req, res) => {
  const vendors = await Vendor.find().sort({ createdAt: -1 });
  res.status(200).json(vendors);
};
const getVendorById = async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  res.status(200).json(vendor);
};
const updateVendor = async (req, res) => {
  const updatedVendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!updatedVendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  res.status(200).json(updatedVendor);
};
const deleteVendor = async (req, res) => {
  const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!deletedVendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  res.status(200).json({ message: "Vendor deleted successfully" });
};
module.exports = {
  createVendor,
  getallVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
