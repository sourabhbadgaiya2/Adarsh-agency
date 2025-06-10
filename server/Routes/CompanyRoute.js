const express = require("express");
const router = express.Router();
const Company = require("../Models/CompanyModel");

// ➕ Create a new Company
router.post("/", async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📄 Get all Companys
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📄 Get a Company by ID
router.get("/:id", async (req, res) => {
  try {
    const Company = await Company.findById(req.params.id);
    if (!Company) return res.status(404).json({ error: "Company not found" });
    res.json(Company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✏️ Update a Company by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany)
      return res.status(404).json({ error: "Company not found" });
    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ❌ Delete a Company by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany)
      return res.status(404).json({ error: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
