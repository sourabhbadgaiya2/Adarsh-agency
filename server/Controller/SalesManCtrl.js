const Salesman = require("../Models/SalesManModel");

// const createSalesman = async (req, res) => {
//   try {
//     const {
//       name,
//       designation,
//       mobile,
//       email,
//       city,
//       address,
//       alternateMobile,
//       username,
//       password,
//     } = req.body;

//     // 🧠 Reconstruct beat array from form-data fields
//     const beats = [];
//     let index = 0;

//     while (req.body[`beat[${index}][areaName]`] !== undefined) {
//       beats.push({
//         areaName: req.body[`beat[${index}][areaName]`],
//         pinCode: req.body[`beat[${index}][pinCode]`] || "",
//       });
//       index++;
//     }

//     const photo = req.file ? req.file.filename : null;

//     const newSalesman = new Salesman({
//       name,
//       designation,
//       mobile,
//       email,
//       city,
//       address,
//       alternateMobile,
//       username,
//       password,
//       beat: beats, // ✅ Now this is a proper array
//       photo,
//     });

//     await newSalesman.save();
//     res.status(201).json({
//       message: "Salesman created successfully",
//       salesman: newSalesman,
//     });
//   } catch (error) {
//     console.error("Error creating salesman:", error);
//     res.status(400).json({ message: error.message });
//   }
// };

const createSalesman = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.photo = req.file.filename;
    }

    data.beat = JSON.parse(data.beat); // ensure beat is parsed to array

    const newSalesman = new Salesman(data);
    await newSalesman.save();
    res.status(201).json(newSalesman);
  } catch (err) {
    console.error("Create Error:", err);
    res
      .status(500)
      .json({ message: "Failed to create salesman", error: err.message });
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

// const updateSalesman = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     if (req.file) {
//       updatedData.photo = req.file.filename;
//     }

//     const updatedSalesman = await Salesman.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     });

//     if (!updatedSalesman) {
//       return res.status(404).json({ message: "Salesman not found" });
//     }

//     res.status(200).json({
//       message: "Salesman updated successfully",
//       salesman: updatedSalesman,
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const updateSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // console.log("Raw Beat From Request:", updatedData.beat);

    // 🧠 Fix: Safely parse beat in different formats
    if (typeof updatedData.beat === "string") {
      try {
        updatedData.beat = JSON.parse(updatedData.beat);
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Invalid beat format (string)." });
      }
    } else if (
      Array.isArray(updatedData.beat) &&
      typeof updatedData.beat[0] === "string"
    ) {
      try {
        updatedData.beat = JSON.parse(updatedData.beat[0]);
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Invalid beat format (array of string)." });
      }
    }

    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    const updatedSalesman = await Salesman.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedSalesman) {
      return res.status(404).json({ message: "Salesman not found." });
    }

    res.status(200).json({
      message: "Salesman updated successfully",
      salesman: updatedSalesman,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      message: "Failed to update salesman",
      error: error.message,
    });
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
