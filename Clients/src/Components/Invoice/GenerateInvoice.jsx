// import React, { useEffect, useState } from "react";
// import { Table } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import axios from "../../Config/axios";

// const GenerateInvoice = () => {
//   const { id } = useParams();
//   const [invoice, setInvoice] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const response = await axios.get(`/pro-billing/${id}`);
//         setInvoice(response.data);
//       } catch (error) {
//         console.error("Error fetching invoice:", error);
//         setError("Failed to load invoice. Please try again.");
//       }
//     };

//     fetchInvoice();
//   }, [id]);

//   if (error) return <p className="text-danger">{error}</p>;
//   if (!invoice) return <p>Loading invoice...</p>;

//   const calculateTotals = () => {
//     if (!invoice.billing) return {};

//     return invoice.billing.reduce((acc, item) => {
//       acc.basicAmount =
//         (acc.basicAmount || 0) + (parseFloat(item.taxableAmount) || 0);
//       acc.sgst = (acc.sgst || 0) + (parseFloat(item.sgst) || 0);
//       acc.cgst = (acc.cgst || 0) + (parseFloat(item.cgst) || 0);
//       acc.total = (acc.total || 0) + (parseFloat(item.total) || 0);
//       return acc;
//     }, {});
//   };

//   const totals = calculateTotals();
//   const {
//     companyId = {},
//     customer = {},
//     billing = [],
//     salesmanId = {},
//   } = invoice;

//   const chunkArray = (arr, size) => {
//     const result = [];
//     for (let i = 0; i < arr.length; i += size) {
//       result.push(arr.slice(i, i + size));
//     }
//     return result;
//   };

//   const billingChunks = chunkArray(billing, 14);

//   return (
//     <div className="container my-2" style={{ padding: "10px" }}>
//       <div
//         style={{
//           // border: "2px solid black",
//           padding: "0",
//           backgroundColor: "#fffbcf",
//         }}
//       >
//         {/* Header Section */}
//         <div
//           className="text-center"
//           style={{
//             borderBottom: "2px solid black",
//             backgroundColor: "#fff8e1",
//             lineHeight: "1px",
//           }}
//         >
//           <h5
//             style={{
//               fontWeight: "bold",
//               fontSize: "24px",
//               marginBottom: "10px",
//             }}
//           >
//             ADARSH AGENCY
//           </h5>
//           <p>H. NO 02, NAGAR TIMBER MARKET, CHOLA, BHOPAL</p>
//           <p>MOB: 9926703332, 8821931550</p>
//           <p>
//             <strong>GSTIN: 23BENPR0816K1ZB</strong>
//           </p>
//         </div>

//         {/* Customer/Bill Info Section */}
//         <div>
//           <div
//             className="p-3"
//             style={{
//               width: "100%",
//               borderBottom: "2px solid black",
//               display: "flex",
//               alignItems: "center",
//               boxSizing: "border-box",
//             }}
//           >
//             {/* Left box */}
//             <div
//               style={{
//                 // border: "1px solid #ddd",
//                 padding: "4px",
//                 width: "48%",
//                 fontSize: "16px",
//                 lineHeight: "1.6",
//                 boxSizing: "border-box",
//               }}
//             >
//               <strong>To:</strong> {companyId.name || "N/A"}
//               <br />
//               {companyId.address || "N/A"}
//               <br />
//               <strong>GSTIN:</strong> {companyId.gstNumber || "N/A"}
//               <br />
//               <strong>number:</strong> {companyId.mobile || "N/A"}
//             </div>

//             {/* Right box */}
//             <div
//               style={{
//                 // border: "1px solid #ddd",
//                 padding: "10px",
//                 width: "30.7%",
//                 fontSize: "16px",
//                 textAlign: "right",
//                 lineHeight: "1.6",
//                 boxSizing: "border-box",
//                 // paddingTop: "10px"
//               }}
//             >
//               <strong>Bill No:</strong> {invoice._id?.slice(-6)}
//               <br />
//               <strong>Date:</strong>{" "}
//               {new Date(customer?.Billdate).toLocaleDateString("en-GB")}
//               <br />
//               <strong>Salesman:</strong> {salesmanId?.name || "N/A"}
//               <br />
//               <strong>number:</strong> {salesmanId?.mobile || "-"}
//             </div>
//           </div>

//           {/* Billing Items Section */}
//           {billingChunks.map((chunk, pageIndex) => (
//             <div
//               className={`p-0 ${
//                 pageIndex < billingChunks.length - 1 ? "page-break" : ""
//               }`}
//               key={pageIndex}
//             >
//               <Table bordered className="mb-0">
//                 <thead>
//                   <tr
//                     style={{
//                       borderBottom: "2px solid black",
//                       backgroundColor: "#f5f5f5",
//                     }}
//                   >
//                     <th>#</th>
//                     <th>Item Name</th>
//                     <th>HSN Code</th>
//                     <th>GST</th>
//                     <th>Qty</th>
//                     <th>Free</th>
//                     <th>Rate</th>
//                     <th>Sch%</th>
//                     <th>Sch Amt</th>
//                     <th>CD%</th>
//                     <th>Total</th>
//                     <th>SGST</th>
//                     <th>CGST</th>
//                     <th>Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {chunk.map((item, index) => (
//                     <tr key={index}>
//                       <td>{pageIndex * 14 + index + 1}</td>
//                       <td>{item.itemName || "N/A"}</td>
//                       <td>{item.productId?.hsnCode || "N/A"}</td>
//                       <td>{item.gst || 0}</td>
//                       <td>{`${item.qty || 0} ${item.unit}`}</td>
//                       <td>{item.Free || 0}</td>
//                       <td>{item.rate || 0}</td>
//                       <td>{item.sch || 0}</td>
//                       <td>{item.schAmt || 0}</td>
//                       <td>{item.cd || 0}</td>
//                       <td>{item.total || 0}</td>
//                       <td>{item.sgst || 0}</td>
//                       <td>{item.cgst || 0}</td>
//                       <td>{item.amount || 0}</td>
//                     </tr>
//                   ))}
//                   {/* Insert Totals only on the last page */}
//                   {pageIndex === billingChunks.length - 1 && (
//                     <tr
//                       style={{
//                         borderTop: "2px solid black",
//                         backgroundColor: "#f5f5f5",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       <td>Sr</td>
//                       <td colSpan={1}>
//                         Basic Amount: {totals.basicAmount?.toFixed(2) || "0.00"}
//                       </td>
//                       <td>QTY:</td>
//                       <td>C/S 0</td>
//                       <td></td>
//                       <td>0</td>
//                       <td></td>
//                       <td></td>
//                       <td>
//                         {billing
//                           .reduce(
//                             (sum, item) => sum + (parseFloat(item.schAmt) || 0),
//                             0
//                           )
//                           .toFixed(2)}
//                       </td>
//                       <td></td>
//                       <td>{totals.total?.toFixed(2) || "0.00"}</td>
//                       <td>{totals.sgst?.toFixed(2) || "0.00"}</td>
//                       <td>{totals.cgst?.toFixed(2) || "0.00"}</td>
//                       <td>{invoice.finalAmount?.toFixed(2) || "0.00"}</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>
//           ))}
//         </div>
//         {/* Footer Section */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "16px",
//             marginTop: "32px",
//             borderTop: "1px solid #ccc",
//           }}
//         >
//           {/* Left section: Disclaimer */}
//           <div style={{ width: "48%", padding: "8px" }}>
//             <p style={{ marginBottom: "5px" }}>
//               Goods once sold will not be taken back
//             </p>
//             <p style={{ marginBottom: "0" }}>Cheque bounce charges Rs. 500/-</p>
//             <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
//             <p style={{ marginBottom: "0" }}>
//               Subject to Bhopal jurisdiction/-
//             </p>
//             <p>E.&.O.E</p>
//           </div>

//           {/* Right section: Authorized Signatory */}
//           <div
//             style={{
//               position: "relative",
//               right: "21%",
//               textAlign: "right",
//               width: "20%",
//             }}
//           >
//             <p style={{ marginBottom: "0" }}>For ADARSH AGENCY</p>
//             <p style={{ marginTop: "60px", marginBottom: "0" }}>
//               Authorized Signatory
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GenerateInvoice;

import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "../../Config/axios";
import "./Invoice.css"; // Make sure this file exists with the page-break style

const GenerateInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [fullCustomer, setFullCustomer] = useState(null);
  const [allProducts, setAllProsducts] = useState([]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`/pro-billing/${id}`);
        setInvoice(response.data);
        // If invoice has customerId, fetch full customer details
        if (response.data.customerId?._id) {
          const customerResponse = await axios.get(
            `/customer/${response.data.customerId._id}`
          );
          setFullCustomer(customerResponse.data);
        }
        if (response.data.productId?._id) {
          const productResponse = await axios.put(
            `/product/${response.data.productId?._id}`
          );
          setAllProsducts(productResponse.data);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to load invoice. Please try again.");
      }
    };

    fetchInvoice();
  }, [id]);
  console.log(invoice, "ldfjsl");
  if (error) return <p className="text-danger">{error}</p>;
  if (!invoice) return <p>Loading invoice...</p>;

  const calculateTotals = () => {
    if (!invoice.billing) return {};

    return invoice.billing.reduce((acc, item) => {
      acc.basicAmount =
        (acc.basicAmount || 0) + (parseFloat(item.taxableAmount) || 0);
      acc.sgst = (acc.sgst || 0) + (parseFloat(item.sgst) || 0);
      acc.cgst = (acc.cgst || 0) + (parseFloat(item.cgst) || 0);
      acc.total = (acc.total || 0) + (parseFloat(item.total) || 0);
      return acc;
    }, {});
  };
  console.log(invoice, "invoice");

  const totals = calculateTotals();
  const {
    companyId = {},
    customer = {},
    billing = [],
    salesmanId = {},
  } = invoice;

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const billingChunks = chunkArray(billing, 14);

  return (
    <div
      id="invoice-container"
      className="container my-2"
      style={{
        backgroundColor: "#fae399",
        padding: "5px",
        margin: "0 auto",
      }}
    >
      {billingChunks.map((chunk, pageIndex) => (
        <div
          className={`invoice-page ${
            pageIndex < billingChunks.length - 1 ? "page-break" : ""
          }`}
          key={pageIndex}
        >
          {/* Header Section */}
          <div
            className="text-center"
            style={{
              borderBottom: "2px solid black",
              backgroundColor: "#fae399",
              lineHeight: "1px",
            }}
          >
            <h5
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                marginBottom: "10px",
              }}
            >
              ADARSH AGENCY
            </h5>
            <p>H. NO 02, NAGAR TIMBER MARKET, CHOLA, BHOPAL</p>
            <p>MOB: 9926703332, 8821931550</p>
            <p>
              <strong>GSTIN: 23BENPR0816K1ZB</strong>
            </p>
          </div>

          {/* Customer/Bill Info Section */}
          <div>
            <div
              className="p-3"
              style={{
                width: "100%",
                borderBottom: "2px solid black",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              {/* Left box */}
              <div
                style={{
                  padding: "4px",
                  width: "48%",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  boxSizing: "border-box",
                }}
              >
                <strong>Customer Name:</strong>{" "}
                {console.log("Customer ID:", fullCustomer?.firm)}
                {fullCustomer?.firm || "N/A"}
                <br />
                <strong>Address:</strong> {fullCustomer?.address || "N/A"}
                <br />
                <strong>Mobile:</strong> {fullCustomer?.mobile || "N/A"}
                <br />
                <strong>GSTIN:</strong> {fullCustomer?.gstNumber || "N/A"}
              </div>

              {/* Right box */}
              <div
                style={{
                  padding: "10px",
                  width: "30.7%",
                  fontSize: "16px",
                  textAlign: "right",
                  lineHeight: "1.6",
                  boxSizing: "border-box",
                }}
              >
                <strong>Bill No:</strong> {invoice._id?.slice(-6)}
                <br />
                <strong>Date:</strong>{" "}
                {new Date(customer?.Billdate).toLocaleDateString("en-GB")}
                <br />
                <strong>Salesman:</strong> {salesmanId?.name || "N/A"}
                <br />
                <strong>number:</strong> {salesmanId?.mobile || "-"}
              </div>
            </div>

            {/* Billing Table */}
            <Table
              bordered
              className="mb-0"
              id="tabling"
              style={{ backgroundColor: "#FAE399 !important" }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid black",
                    backgroundColor: "#fae399",
                  }}
                >
                  <th>#</th>
                  <th>Item Name</th>
                  <th>HSN Code</th>
                  <th>MRP</th>
                  <th>Qty</th>
                  <th>Free</th>
                  <th>Rate</th>
                  <th>Sch%</th>
                  <th>Sch Amt</th>
                  <th>CD%</th>
                  <th>Total</th>
                  <th>SGST</th>
                  <th>CGST</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {chunk.map((item, index) => (
                  <tr key={index}>
                    <td>{pageIndex * 14 + index + 1}</td>
                    <td>{item.itemName || "N/A"}</td>
                    <td>{item.productId?.hsnCode || "N/A"}</td>
                    <td>{item.allProducts?.mrp || 0}</td>
                    <td>
                      {`${item.qty || 0} 
                    `}
                      {/* ${item.unit} */}
                    </td>
                    <td>{item.Free || 0}</td>
                    <td>{item.rate || 0}</td>
                    <td>{item.sch || 0}</td>
                    <td>{item.schAmt || 0}</td>
                    <td>{item.cd || 0}</td>
                    <td>{item.total || 0}</td>
                    <td>
                      {(item.productId?.gstPercent || 0) / 2} {/* SGST */}
                    </td>
                    <td>
                      {(item.productId?.gstPercent || 0) / 2} {/* CGST */}
                    </td>

                    <td>{item.amount || 0}</td>
                  </tr>
                ))}
                {pageIndex === billingChunks.length - 1 && (
                  <tr
                    style={{
                      borderTop: "2px solid black",
                      backgroundColor: "#fae399",
                      fontWeight: "bold",
                    }}
                  >
                    <td>Sr</td>
                    <td colSpan={1}>
                      Basic Amount: {totals.basicAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td>QTY:</td>
                    <td>C/S 0</td>
                    <td></td>
                    <td>0</td>
                    <td></td>
                    <td></td>
                    <td>
                      {billing
                        .reduce(
                          (sum, item) => sum + (parseFloat(item.schAmt) || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td></td>
                    <td>{totals.total?.toFixed(2) || "0.00"}</td>
                    <td>{totals.sgst?.toFixed(2) || "0.00"}</td>
                    <td>{totals.cgst?.toFixed(2) || "0.00"}</td>
                    <td>{invoice.finalAmount?.toFixed(2) || "0.00"}</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Footer Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                marginTop: "32px",
                borderTop: "1px solid #ccc",
              }}
            >
              <div style={{ width: "48%", padding: "8px" }}>
                <p>Goods once sold will not be taken back</p>
                <p style={{ marginBottom: "0" }}>
                  Cheque bounce charges Rs. 500/-
                </p>
                <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
                <p style={{ marginBottom: "0" }}>
                  Subject to Bhopal jurisdiction/-
                </p>
                <p>E.&.O.E</p>
              </div>

              <div
                style={{
                  position: "relative",
                  right: "21%",
                  textAlign: "right",
                  width: "20%",
                }}
              >
                <p style={{ marginBottom: "0" }}>For ADARSH AGENCY</p>
                <p style={{ marginTop: "60px", marginBottom: "0" }}>
                  Authorized Signatory
                </p>
              </div>
            </div>
            <hr />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenerateInvoice;
