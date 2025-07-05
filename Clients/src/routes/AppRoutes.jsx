// src/routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
// import Dashbord from '../Components/Dashbord/Dashbord';
import Layout from "../Layout/Layout";
import DashboardCards from "../Components/Dashbord/DashboardCards";
import CompanyDetail from "../Components/Productss/Company/CompanyDetail";
import CategoryDetail from "../Components/Productss/ProductCategory/CategoryDetail";
import SubCatDetail from "../Components/Productss/ProductSubCategory/SubCatDetail";

import Product from "../Components/Productss/CreateProduct/ProductTabs";

import AddSalesMan from "../Components/SalesMan/salesMan-Tabs/SalesmanTabs";
import DisplaySalesMan from "../Components/SalesMan/salesMan-Tabs/DisplaySalesMan";
import BillingReport from "../Components/Invoice/BillingReport";
import DisplayInvoice from "../Components/Invoice/DisplayInvoice";
import GenerateInvoice from "../Components/Invoice/GenerateInvoice";

import VendorReport from "../Components/SalesMan/vendorReport/vendorTabs";

import PurchaseForm from "../Components/SalesMan/PurchaseForm";
import CustomerDetail from "../Components/Customer/CustomerDetail";
import FirmDetail from "../Components/Firm/FirmDetail";
import Test from "../Components/Test";
import PaymentVoucherForm from "../Components/payment/PaymentVoucherForm";
import Ledger from "../Components/payment/Ledger";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<DashboardCards />} />
        <Route path='/add-company' element={<FirmDetail />} />
        <Route path='/brand' element={<CompanyDetail />} />
        <Route path='/pro-categories' element={<CategoryDetail />} />
        <Route path='/pro-SubCat' element={<SubCatDetail />} />
        <Route path='/product' element={<Product />} />
        <Route path='/add-salesman' element={<AddSalesMan />} />
        <Route path='/add-salesman/:id' element={<AddSalesMan />} />
        <Route path='/display-salesman' element={<DisplaySalesMan />} />
        <Route path='/add-invoice' element={<BillingReport />} />
        <Route path='/generate-invoice' element={<GenerateInvoice />} />
        <Route path='/display-invoice' element={<DisplayInvoice />} />
        <Route path='/generate-invoice/:id' element={<GenerateInvoice />} />
        <Route path='/Vendor-report' element={<VendorReport />} />
        <Route path='/purchase' element={<PurchaseForm />} />
        <Route path='/add-customer' element={<CustomerDetail />} />

        <Route path='/test' element={<PaymentVoucherForm />} />
        <Route path='/ledger' element={<Ledger />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
