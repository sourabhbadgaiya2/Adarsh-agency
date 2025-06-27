import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./features/product/productSlice";
import companyReducer from "./features/company/companySlice";
import salesmanReducer from "./features/salesMan/salesManSlice";
import customerReducer from "./features/customer/customerSlice";
import categoryReducer from "./features/Category/categorySlice";

import vendorReducer from "./features/vendor/vendorSlice";
import purchaseReducer from "./features/purchase/purchaseSlice";
import invoiceReducer from "./features/product-bill/invoiceSlice";
import subCategoryReducer from "./features/subCategory/subCategorySlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    product: productReducer,
    customer: customerReducer,
    category: categoryReducer,
    salesman: salesmanReducer,
    invoice: invoiceReducer,
    vendor: vendorReducer,
    purchase: purchaseReducer,
    subCategory: subCategoryReducer,
  },
});
