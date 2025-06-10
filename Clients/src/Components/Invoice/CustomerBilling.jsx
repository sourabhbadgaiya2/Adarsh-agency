import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../../Config/axios";
import Select from "react-select";

const CustomerBilling = ({ onDataChange }) => {
  // fetch company name to dispalya in drop down

  const [customer, setcustomer] = useState([]);

  // selected Customer
  const [selectedCustomer, setselectedCustomer] = useState(null);

  const fetchcustomer = async () => {
    try {
      const res = await axios.get("/customer");
      console.log(res.data);
      setcustomer(res.data);
    } catch (err) {
      console.error(err);
      // alert("Failed to fetch customer");
    }
  };

  // sales man

  // State
  const [salesmen, setSalesmen] = useState([]); // ✅ Initialize as array

  // Fetch function
  const fetchSalesmen = async () => {
    try {
      const response = await axios.get("/salesman");
      setSalesmen(response.data.Data); // ✅ Fix this line
    } catch (error) {
      console.error("Error fetching saleslesmen:", error);
    }
  };

  console.log(salesmen, "sales man");

  useEffect(() => {
    fetchcustomer();
    fetchSalesmen();
  }, []);

  const [formData, setFormData] = useState({
    CustomerName: "",

    Billdate: "",
    advanceAmt: "",
    paymentMode: "",
  });
  console.log(customer, "ghfhj");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedForm);

    // Include selectedCustomer._id if selected
    onDataChange({
      ...updatedForm,
      customerId: selectedCustomer?._id || null, // Pass customer ID if selected
      customerName: selectedCustomer?.name || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add backend integration here
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Customer Information</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Customer Name */}
          <div className="form-group col-md-6">
            <div className="form-group col-md-6">
              <label className="form-label">
                <strong>Select Customer</strong>
              </label>
              <Select
                options={customer.map((customer) => ({
                  label: customer.firm,
                  value: customer._id,
                }))}
                value={
                  selectedCustomer
                    ? {
                        label: selectedCustomer.firm,
                        value: selectedCustomer._id,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  const customerObj = customer.find(
                    (c) => c._id === selectedOption.value
                  );
                  setselectedCustomer(customerObj);

                  // Pass customer ID and name along with form data
                  const updatedForm = {
                    ...formData,
                    customerId: customerObj._id,
                    customerName: customerObj.firm,
                  };
                  setFormData(updatedForm); // Optional: update form state too
                  onDataChange(updatedForm);
                }}
                placeholder="Select a Customer..."
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>
          </div>
          {/* Bill Date */}
          <div className="form-group col-md-6">
            <label>Bill Date</label>
            <input
              type="date"
              className="form-control"
              name="Billdate"
              value={formData.Billdate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Advance Amount */}
          <div className="form-group col-md-6" style={{ fontWeight: "bold" }}>
            <label>Advance Amount</label>
            <input
              type="Number"
              name="advanceAmt"
              className="form-control"
              value={formData.advanceAmt}
              onChange={handleChange}
            />
          </div>

          {/* Payment Mode */}
          <div className="form-group col-md-6" style={{ fontWeight: "bold" }}>
            <label>Payment Mode</label>
            <select
              name="paymentMode"
              className="form-control"
              value={formData.paymentMode}
              onChange={handleChange}
            >
              <option value="">-- Select Payment Mode --</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Ordered By */}
          <div className="form-group col-md-12" style={{ fontWeight: "bold" }}>
            <label>Ordered By (Salesman)</label>
            <select
              name="salesmanId" // ✅ name should be salesmanId
              className="form-control"
              value={formData.salesmanId || ""}
              onChange={(e) => {
                const updatedForm = {
                  ...formData,
                  salesmanId: e.target.value, // ✅ save salesman _id
                };
                setFormData(updatedForm);
                onDataChange({
                  ...updatedForm,
                  companyId: selectedCustomer?._id || null,
                });
              }}
            >
              <option value="">-- Select Salesman --</option>
              {Array.isArray(salesmen) &&
                salesmen.map((salesman) => (
                  <option key={salesman._id} value={salesman._id}>
                    {salesman.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default CustomerBilling;
