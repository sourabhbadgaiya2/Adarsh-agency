require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(
  cors({
    origin: ["https://adarsh-agency.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    credentials: true, // if you're using cookies/auth headers
  })
);
// ---------Routes----------
// const adminRoute = require("./Routes/adminRoute");
// const FirmRoute = require("./Routes/FirmRoute");
const CompanyRoute = require("./Routes/CompanyRoute");
const CategoryRoute = require("./Routes/CategoryRoute");
const SubCategoryRoute = require("./Routes/SubCategoryRoute");
const ProductRoute = require("./Routes/ProductRoute");
const SalesManRoute = require("./Routes/SalesManRoute");
const BillingRoute = require("./Routes/ProductBillingRoute");
const VendorRoute = require("./Routes/VendorRoute");
const PurchaseRoute = require("./Routes/PurchaseRoute");
const customerRoutes = require("./Routes/CustomerRoute");

// ---------------------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.dbUrl)
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ---------Routes----------

app.use(express.static(path.join(__dirname, "public")));
// app.use("public", express.static(path.join(__dirname, "public/Images")));

app.use("/payment", require("./Routes/payment.routes"));
// app.use("/api/firm", FirmRoute);
app.use("/api/company", CompanyRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/customer", customerRoutes);
app.use("/api/product", ProductRoute);
app.use("/api/Subcategory", SubCategoryRoute);
app.use("/api/salesman", SalesManRoute);
app.use("/api/pro-billing", BillingRoute);
app.use("/api/vendor", VendorRoute);
app.use("/api/purchase", PurchaseRoute);

const port = process.env.PORT;

// -----------------------
// 🔴 Global Error Handling
// -----------------------

// 404 Not Found

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.use((req, res, next) => {
  const error = new Error("🔍 Resource not found");
  error.status = 404;
  next(error);
});

app.listen(port, () => {
  console.log(`Server Run on ${port} Port`);
});
