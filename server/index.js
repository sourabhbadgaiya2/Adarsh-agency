require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(cors());
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

// app.use("/admin", adminRoute);
// app.use("/api/firm", FirmRoute);
app.use("/api/company", CompanyRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/Subcategory", SubCategoryRoute);
app.use("/api/product", ProductRoute);
app.use("/api/salesman", SalesManRoute);
app.use("/api/pro-billing", BillingRoute);
app.use("/api/vendor", VendorRoute);
app.use("/api/purchase", PurchaseRoute);
app.use("/api/customer", customerRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server Run on ${port} Port`);
});
