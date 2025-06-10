// models/Vendor.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  firm: {
    type: String,
    required: true,
  },
  name: String,
  designation: String,
  mobile: Number,
  alternateMobile: Number,
  email: String,
  whatsapp: Number,
  city: String,
  address: String,
  gstNumber: {
    type: String,
  },
  address: String,
});

module.exports = mongoose.model("Vendor", vendorSchema);
