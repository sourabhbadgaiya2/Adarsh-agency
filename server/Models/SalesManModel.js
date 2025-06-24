// // models/Salesman.js
// const mongoose = require("mongoose");

// const salesmanSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//     ,
//       trim: true,
//     },
//     designation: {
//       type: String,
//       trim: true,
//     },
//     beat: [
//       {
//         type: String,
//         area: "",
//       },
//     ],
//     mobile: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     email: {
//       type: String,
//       trim: true,
//       lowercase: true,
//     },
//     city: {
//       type: String,
//       trim: true,
//     },
//     address: {
//       type: String,
//       trim: true,
//     },
//     alternateMobile: {
//       type: String,
//       trim: true,
//     },
//     photo: {
//       type: String, // This could be a file path or URL
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Salesman", salesmanSchema);

// !--------------------
const mongoose = require("mongoose");

const BeatSchema = new mongoose.Schema({
  area: { type: String, required: true },
});

const SalesmanSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: String },
  city: { type: String },
  address: { type: String },
  alternateMobile: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  beat: { type: [BeatSchema], default: [] },
  photo: { type: String },
});

module.exports = mongoose.model("Salesman", SalesmanSchema);
