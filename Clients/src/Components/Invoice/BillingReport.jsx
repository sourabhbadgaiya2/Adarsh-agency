import React, { useState } from "react";
import axios from "../../Config/axios";
import ProductBillingReport from "./ProductBillingReport";
import CustomerBilling from "./CustomerBilling";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
// import { useNavigate } from "react-router-dom"; // ✅ Correct import

function BillingReport() {
  const [billingData, setBillingData] = useState([]);
  const [customerData, setCustomerData] = useState({});
  // const navigate = useNavigate(); // ✅ Correct hook
  const [finalAmount, setFinalAmount] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const [loading, setLoading] = useState(false);

  const handleBillingDataChange = (data, totalAmount) => {
    setBillingData(data);
    setFinalAmount(parseFloat(totalAmount)); // ✅ Now correct
  };

  const handleCustomerDataChange = (data) => {
    setCustomerData(data);
  };
  const resetForm = () => {
    setBillingData([]);
    setCustomerData({});
    setFinalAmount(0);
    setResetKey((prev) => prev + 1); // 🔁 Trigger re-mount of children
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const finalData = {
        companyId: customerData.companyId,
        salesmanId: customerData.salesmanId,
        customerId: customerData.customerId, // ✅ Use _id for customerId
        customer: customerData,
        customerName: customerData.name,
        billing: billingData,
        finalAmount, // ✅ Include this
      };

      const response = await axios.post("/pro-billing", finalData);
      toast.success("Invoice saved successfully!");

      console.log(response.data, "Response from server"); // ✅ Log the response
      // const invoiceId = response._id;

      // 🔁 Reset form after toast (e.g., after 3 seconds)
      setTimeout(() => {
        resetForm();
      }, 3000);
      // navigate(`/generate-invoice/${invoiceId}`); // ✅ Works correctly now
      // console.log("Response from server:", response.data);
    } catch (error) {
      toast.error("Failed to save invoice");
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ProductBillingReport
        onBillingDataChange={handleBillingDataChange}
        key={resetKey}
      />
      <CustomerBilling
        key={resetKey + 100} // avoid collision
        onDataChange={handleCustomerDataChange}
      />

      <hr />
      <div className='text-center mt-4'>
        <button
          className='btn btn-primary px-4 py-2'
          onClick={handleSubmit}
          style={{ fontWeight: "bold", fontSize: "16px", borderRadius: "8px" }}
        >
          Submit
        </button>
      </div>

      <ToastContainer position='top-right' autoClose={3000} />
    </>
  );
}

export default BillingReport;
