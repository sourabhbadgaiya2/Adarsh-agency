import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Config/axios";
import "./Invoice.css";
import Loader from "../Loader";
import { toWords } from "number-to-words";

const GenerateInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [fullCustomer, setFullCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // For storing product info for each productId
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/pro-billing/${id}`);
        setInvoice(response.data);

        // Fetch full customer
        if (response.data.customerId?._id) {
          const customerResponse = await axios.get(
            `/customer/${response.data.customerId._id}`
          );
          setFullCustomer(customerResponse.data);
        }

        // Fetch all product details in parallel
        if (response.data.billing?.length > 0) {
          const uniqueProductIds = [
            ...new Set(
              response.data.billing
                .map((item) => item.productId?._id)
                .filter((id) => id)
            ),
          ];

          const productResponses = await Promise.all(
            uniqueProductIds.map((id) => axios.get(`/product/${id}`))
          );

          const productMap = {};
          uniqueProductIds.forEach((id, index) => {
            productMap[id] = productResponses[index].data;
          });

          setProductDetails(productMap);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to load invoice. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (error) return <p className='text-danger'>{error}</p>;
  if (loading || !invoice) return <Loader />;

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

  const totals = calculateTotals();
  const { customer = {}, billing = [], salesmanId = {} } = invoice;

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
      id='invoice-container'
      className='container my-2'
      style={{
        backgroundColor: "#fae399",
        padding: "5px",
        margin: "0 auto",
        border: "1px solid black",
      }}
    >
      <div className='container'>
        <button
          onClick={() => window.print()}
          className='btn btn-primary my-3 d-print-none'
        >
          Print Invoice
        </button>
      </div>
      {billingChunks.map((chunk, pageIndex) => (
        <div
          className={`invoice-page ${
            pageIndex < billingChunks.length - 1 ? "page-break" : ""
          }`}
          key={pageIndex}
        >
          {/* Header Section */}
          <div
            className=''
            style={{
              borderBottom: "2px solid black",
              backgroundColor: "#fae399",
              lineHeight: "1px",
              borderBottomStyle: "dashed",
            }}
          >
            <div className='text-center'>
              <h5
                style={{
                  fontWeight: "bold",
                  fontSize: "24px",
                  marginBottom: "10px",
                }}
              >
                ADARSH AGENCY
              </h5>
              <p style={{ marginBottom: "25px" }}>
                H.NO.02, NAGAR NIGAM COLONY TIMBER MARKET CHHOLA BHOPAL
              </p>
              <p className=''>MOB: 9926793332, 9893315590</p>
              <p className='m-4'>
                <strong>GSTIN: 23BENPR0816K1ZB</strong>
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div
            className='p-3'
            style={{
              width: "100%",
              borderBottom: "2px solid black",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "4px",
                width: "48%",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              <strong>Customer Name:</strong> {fullCustomer?.firm || "N/A"}{" "}
              <br />
              <strong>Address:</strong> {fullCustomer?.address || "N/A"} <br />
              <strong>Mobile:</strong> {fullCustomer?.mobile || "N/A"} <br />
              <strong>GSTIN:</strong> {fullCustomer?.gstNumber || "N/A"}
            </div>
            <div
              style={{
                padding: "10px",
                width: "30.7%",
                fontSize: "16px",
                textAlign: "right",
                lineHeight: "1.6",
              }}
            >
              <strong>Bill No:</strong> {invoice._id?.slice(-6)} <br />
              <strong>Date:</strong>{" "}
              {new Date(customer?.Billdate).toLocaleDateString("en-GB")} <br />
              <strong>Salesman:</strong> {salesmanId?.name || "N/A"} <br />
              <strong>Number:</strong> {salesmanId?.mobile || "-"}
            </div>
          </div>

          {/* Billing Table */}
          <Table
            bordered
            className='mb-0'
            id='tabling'
            style={{ backgroundColor: "#FAE399 !important" }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid black",
                  backgroundColor: "#fae399",
                }}
              >
                <th>SR</th>
                <th>Item Name</th>
                <th>HSN Code</th>
                <th>MRP</th>
                <th>Qty</th>
                <th>Free</th>
                <th>Rate</th>
                <th>Sch%</th>
                <th>Sch Amt</th>
                <th>CD%</th>
                <th>Amount</th>
                <th>SGST</th>
                <th>CGST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((item, index) => {
                const product = productDetails[item.productId?._id] || {};
                const gst = product?.gstPercent || 0;
                return (
                  <tr key={index}>
                    <td>{pageIndex * 14 + index + 1}</td>
                    <td>{item.itemName || "N/A"}</td>
                    <td>{product.hsnCode || "N/A"}</td>
                    <td>{product.mrp || 0}</td>
                    <td>{item.qty || 0}</td>
                    <td>{item.Free || 0}</td>
                    <td>{item.rate || 0}</td>
                    <td>{item.sch || 0}</td>
                    <td>{item.schAmt || 0}</td>
                    <td>{item.cd || 0}</td>
                    <td>{item.total || 0}</td>
                    <td>{gst / 2}</td>
                    <td>{gst / 2}</td>
                    <td>{item.amount || 0}</td>
                  </tr>
                );
              })}
              {pageIndex === billingChunks.length - 1 && (
                <tr
                  style={{
                    borderTop: "2px solid black",
                    backgroundColor: "#fae399",
                    fontWeight: "bold",
                  }}
                >
                  <td></td>
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

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              marginTop: "32px",
              borderTop: "1px solid #ccc",
              width: "90%",
            }}
          >
            <div style={{ padding: "8px" }}>
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
                // right: "21%",
                textAlign: "center",
                borderLeft: "1px solid black",
                padding: "15px",
                // width: "20%",
              }}
            >
              <h5>Bill Amount (R) : {invoice.finalAmount?.toFixed(2)}</h5>
              <p
                style={{
                  marginTop: "10px",
                  borderTop: "1px solid black",
                  borderTopStyle: "dashed",
                  paddingTop: "5px",
                }}
              >
                For: ADARSH AGENCY
              </p>
              <p style={{ marginTop: "20px", marginBottom: "10px" }}>
                Authorized Signatory
              </p>
              {invoice.finalAmount > 0 && (
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                  Rs.{" "}
                  {toWords(Math.floor(invoice.finalAmount)).replace(
                    /\b\w/g,
                    (l) => l.toUpperCase()
                  )}{" "}
                  Only
                </p>
              )}
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default GenerateInvoice;
