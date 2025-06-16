const Salesman = require("../Models/SalesManModel");

const createSalesman = async (req, res) => {
  try {
    const {
      name,
      designation,
      mobile,
      email,
      city,
      address,
      alternateMobile,
      username,
      password,
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const newSalesman = new Salesman({
      name,
      designation,
      mobile,
      email,
      city,
      address,
      alternateMobile,
      username,
      password,
      photo,
    });

    await newSalesman.save();
    res.status(201).json({
      message: "Salesman created successfully",
      salesman: newSalesman,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Display = async (req, res) => {
  try {
    const Data = await Salesman.find();
    res.status(200).send({ Data });
    // console.log(Data);
  } catch (error) {
    console.error("Error fetching Sales Man:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to fetch Data", error: error.message });
  }
};

const getSingleSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const salesman = await Salesman.findById(id);
    if (!salesman) {
      return res.status(404).json({ message: "Salesman not found" });
    }
    res.status(200).json(salesman);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    const updatedSalesman = await Salesman.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedSalesman) {
      return res.status(404).json({ message: "Salesman not found" });
    }

    res.status(200).json({
      message: "Salesman updated successfully",
      salesman: updatedSalesman,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Salesman.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Salesman not found" });
    }

    res.status(200).json({ message: "Salesman deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createSalesman,
  Display,
  getSingleSalesman,
  updateSalesman,
  deleteSalesman,
};
