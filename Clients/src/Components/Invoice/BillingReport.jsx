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
  const navigate = useNavigate();
  const [finalAmount, setFinalAmount] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const [loading, setLoading] = useState(false);

  const handleBillingDataChange = (data, totalAmount) => {
    setBillingData(data);
    setFinalAmount(parseFloat(totalAmount));
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
    // console.log("LLL");

    setLoading(true);

    try {
      const finalData = {
        companyId: customerData.companyId,
        salesmanId: customerData.salesmanId,
        customerId: customerData.customerId,
        customer: customerData,
        customerName: customerData.name,
        billing: billingData,
        finalAmount,
      };

      const response = await axios.post("/pro-billing", finalData);
      toast.success("Invoice saved successfully!");

      // console.log(response.data, "Response from server");
      const invoiceId = response.data.invoice._id;

      // 🔁 Reset form after toast (e.g., after 3 seconds)
      setTimeout(() => {
        resetForm();
      }, 3000);
      navigate(`/generate-invoice/${invoiceId}`);
    } catch (error) {
      toast.error(error?.response?.data?.details || "Failed to save invoice");
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const productRef = useRef();

  // ... your state and handlers

  const focusNextComponent = () => {
    console.log("Calling productRef.focusItemName()");
    productRef.current?.focusItemName();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <CustomerBilling
        // key={resetKey + 100} // avoid collision
        onDataChange={handleCustomerDataChange}
        resetTrigger={resetKey}
        onNextFocus={focusNextComponent}
      />
      <ProductBillingReport
        ref={productRef}
        onBillingDataChange={handleBillingDataChange}
        key={resetKey}
      />

      <div
        style={{
          fontSize: "12px",
          margin: "4px",
          color: "#555",
          textAlign: "center",
        }}
      >
        Press <strong>Ctrl + Q</strong> to submit
      </div>
      <div className='text-center mt-4'>
        <button
          className='btn btn-primary px-4 py-2'
          onClick={handleSubmit}
          style={{ fontWeight: "bold", fontSize: "16px", borderRadius: "8px" }}
          title='Shortcut: Ctrl + Enter'
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default BillingReport;
