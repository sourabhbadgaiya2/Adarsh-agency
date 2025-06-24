import React, { useEffect, useState, useRef } from "react";
import axios from "../../Config/axios";
import ProductBillingReport from "./ProductBillingReport";
import CustomerBilling from "./CustomerBilling";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

function BillingReport() {
  const [billingData, setBillingData] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const navigate = useNavigate(); // ✅ Correct hook
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
    setResetKey((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    console.log("LLL");

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

      // console.log(response.data, "Response from server"); // ✅ Log the response
      const invoiceId = response.data.invoice._id;

      // 🔁 Reset form after toast (e.g., after 3 seconds)
      setTimeout(() => {
        resetForm();
      }, 3000);
      navigate(`/generate-invoice/${invoiceId}`); // ✅ Works correctly now
      // console.log("Response from server:", response.data);
    } catch (error) {
      toast.error(error?.response?.data?.details || "Failed to save invoice");
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const productRef = useRef(); // 👈 Step 1: Create a ref

  // ... your state and handlers

  const focusNextComponent = () => {
    console.log("Calling productRef.focusItemName()");
    productRef.current?.focusItemName(); // 👈 Step 2: Call this when needed
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <CustomerBilling
        // key={resetKey + 100} // avoid collision
        onDataChange={handleCustomerDataChange}
        resetTrigger={resetKey}
        onNextFocus={focusNextComponent} // 👈 Step 3: pass function to child
      />
      <ProductBillingReport
        ref={productRef} // 👈 Step 4: attach ref
        onBillingDataChange={handleBillingDataChange}
        key={resetKey}
      />
      <hr />
      <div className='text-center mt-4'>
        <button
          // disabled={!customerData.customerId || billingData.length === 0}
          className='btn btn-primary px-4 py-2'
          onClick={handleSubmit}
          style={{ fontWeight: "bold", fontSize: "16px", borderRadius: "8px" }}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default BillingReport;
