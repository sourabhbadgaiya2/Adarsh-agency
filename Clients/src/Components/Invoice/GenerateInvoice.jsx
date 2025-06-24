// !----------------------------------------------------

import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "../../Config/axios";
import Loader from "../Loader";
import { toWords } from "number-to-words";

const GenerateInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [fullCustomer, setFullCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/pro-billing/${id}`);
        setInvoice(response.data);

        if (response.data.customerId?._id) {
          const customerResponse = await axios.get(
            `/customer/${response.data.customerId._id}`
          );

          setFullCustomer(customerResponse.data);
        }

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
      acc.totalQty = (acc.totalQty || 0) + (parseFloat(item.qty) || 0); // ✅ Add this
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

  const itemsPerPage = 16;
  const billingChunks = chunkArray(billing, itemsPerPage);

  if (loading) return <Loader />;

  return (
    <div>
      <div className='container'>
        <button
          onClick={() => window.print()}
          className='btn btn-primary my-3 d-print-none'
        >
          Print Invoice
        </button>
      </div>

      {/* <style>
        {`
  @media print {
    body * {
      visibility: hidden;
    }

    #print-area, #print-area * {
      visibility: visible;
    }

    #print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }

    .d-print-none {
      display: none !important;
    }

    .invoice-page {
      page-break-after: always;
    }

    @page {
       size: A5 landscape;
      margin: 10mm;
    }


    #print-area {
      font-size: 18px !important;
    }


    .invoice-page:not(:last-child) .invoice-footer {
        display: none;
    }

    .invoice-page:not(:last-child) .to-be-continued {
        display: block;
    }
  }
  .to-be-continued {
    display: none;
    text-align: center;
    margin-top: 20px;
    font-weight: bold;
  }
  `}
      </style> */}

      <style>
        {`
    @media print {
      body * {
        visibility: hidden;
      }

      #print-area, #print-area * {
        visibility: visible;
      }

      #print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        font-size: 18px !important; /* Print font size */
      }

      .d-print-none {
        display: none !important;
      }

      /* ✅ Page break only for non-last invoice page */
      .invoice-page:not(:last-child) {
        page-break-after: always;
      }

      @page {
        size: A5 landscape;
        margin: 10mm;
      }

      /* Footer only on last page */
      .invoice-page:not(:last-child) .invoice-footer {
        display: none;
      }

      /* Show 'To be continued...' on non-last pages */
      .invoice-page:not(:last-child) .to-be-continued {
        display: block;
      }
    }

    /* Hidden by default — shown only during print on non-last pages */
    .to-be-continued {
      display: none;
      text-align: center;
      margin-top: 20px;
      font-weight: bold;
    }
  `}
      </style>

      <div id='print-area'>
        {billingChunks.map((chunk, pageIndex) => (
          <div
            key={pageIndex}
            className='invoice-page'
            style={{
              width: "210mm", // A5 width in landscape
              // minHeight: "148mm", // A5 height in landscape
              margin: "auto",
              padding: "1mm",
              // backgroundColor: "#fff",
              // border: "1px solid #ccc",
              fontSize: "12px",
              // boxSizing: "border-box",
            }}
          >
            <div>
              {/* Header */}
              <div
                style={{
                  textAlign: "center",
                  borderBottom: "2px dashed black",
                }}
              >
                <h5 style={{ fontWeight: "bold", fontSize: "24px" }}>
                  {/* ADARSH AGENCY */}
                  SAMRIDDHI ENTERPRISES
                </h5>
                <p>H.NO.02, NAGAR NIGAM COLONY TIMBER MARKET CHHOLA BHOPAL</p>
                <p>MOB: 9926793332, 9893315590</p>
                <p>
                  {/* <strong>GSTIN: 23BENPR0816K1ZB</strong> */}
                  <strong>GSTIN: 23BJUPR9537F1ZK</strong>
                </p>
              </div>

              {/* Customer Info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid black",
                  marginTop: "15px",
                  paddingBottom: "10px",
                  fontSize: "13px",
                }}
              >
                <div style={{ width: "48%" }}>
                  <strong>Customer Name:</strong>{" "}
                  {fullCustomer?.ledger || "N/A"} <br />
                  <strong>Address:</strong> {fullCustomer?.address1 || "N/A"}{" "}
                  <br />
                  <strong>Mobile:</strong> {fullCustomer?.mobile || "N/A"}{" "}
                  <br />
                  <strong>GSTIN:</strong> {fullCustomer?.gstNumber || "N/A"}
                </div>
                <div style={{ textAlign: "right", width: "48%" }}>
                  <strong>Bill No:</strong> {invoice._id?.slice(-6)} <br />
                  <strong>Date:</strong>{" "}
                  {new Date(customer?.Billdate).toLocaleDateString("en-GB")}{" "}
                  <br />
                  <strong>Salesman:</strong> {salesmanId?.name || "N/A"} <br />
                  <strong>Number:</strong> {salesmanId?.mobile || "-"}
                </div>
              </div>

              {/* Table */}
              <Table
                bordered
                className='mt-3 table-sm'
                style={{ border: "1px solid #000", fontSize: "12px" }}
              >
                <thead>
                  <tr>
                    {[
                      "SR",
                      "Item Name",
                      "HSN Code",
                      "MRP",
                      "Qty",
                      "Free",
                      "Rate",
                      "Sch%",
                      "Sch Amt",
                      "CD%",
                      "Amount",
                      "SGST",
                      "CGST",
                      "Total",
                    ].map((header, i) => (
                      <th
                        key={i}
                        style={{
                          border: "1px solid black",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chunk.map((item, index) => {
                    const product = productDetails[item.productId?._id] || {};
                    const gst = product?.gstPercent || 0;
                    return (
                      <tr key={index}>
                        <td className='border border-black p-1 text-center'>
                          {pageIndex * itemsPerPage + index + 1}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.itemName || "N/A"}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {product.hsnCode || "N/A"}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {product.mrp || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.qty || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.Free || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.rate || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.sch || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.schAmt || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.cd || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.total || 0}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {gst / 2}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {gst / 2}
                        </td>
                        <td className='border border-black p-1 text-center'>
                          {item.amount || 0}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Fill empty rows if needed for consistent page height, not strictly required for this specific request */}
                  {/* You can add empty rows here to fill up to `itemsPerPage` if less items are in the chunk */}
                  {chunk.length < itemsPerPage &&
                    pageIndex === billingChunks.length - 1 &&
                    Array.from({ length: itemsPerPage - chunk.length }).map(
                      (_, i) => <tr key={`empty-${i}`}></tr>
                    )}

                  {/* Totals row only on the last page */}
                  {pageIndex === billingChunks.length - 1 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td className='border border-black p-1'></td>
                      <td className='border border-black p-1' colSpan={1}>
                        Basic Amount: {totals.total?.toFixed(2) || "0.00"}
                        {/* {totals.total?.toFixed(2) || "0.00"} */}
                      </td>
                      {/* <td className=''>QTY: </td>
                      <td className=''>C/S 0</td>
                      <td className=''>PCS 0</td> */}
                      <td
                        className='p-1'
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                        }}
                      >
                        QTY:{" "}
                      </td>{" "}
                      {/* HSN Code (3) */}
                      <td
                        className='p-1'
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                        }}
                      >
                        C/S 0
                      </td>{" "}
                      {/* MRP (4) */}
                      <td
                        className='p-1'
                        style={{
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                          borderTop: "1px solid black",
                        }}
                      >
                        PCS : {totals.totalQty || 0}
                      </td>{" "}
                      {/* Qty (5) */}
                      {/* <td className='border border-black'></td> */}
                      <td className='border border-black p-1'>0</td>
                      <td className='border border-black p-1'></td>
                      <td className='border border-black p-1'></td>
                      <td className='border border-black p-1'>
                        {billing
                          .reduce(
                            (sum, item) => sum + (parseFloat(item.schAmt) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className='border border-black p-1'></td>
                      <td className='border border-black p-1'>
                        {totals.total?.toFixed(2) || "0.00"}
                      </td>
                      <td className='border border-black p-1'>
                        {/* {totals.sgst?.toFixed(2) || "0.00"}asd */}
                        {/* SGST (6% of total) */}
                        {((totals.total || 0) * 0.06).toFixed(2)}
                      </td>
                      <td className='border border-black p-1'>
                        {totals.cgst?.toFixed(2) || "0.00"}
                      </td>
                      <td className='border border-black p-1'>
                        {invoice.finalAmount?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* "To be continued..." for non-last pages */}
              {pageIndex < billingChunks.length - 1 && (
                <div className='to-be-continued'>To be continued...</div>
              )}

              {/* Footer - only on the last page */}
              {pageIndex === billingChunks.length - 1 && (
                <div
                  className='invoice-footer '
                  style={{
                    display: "flex",
                    // justifyContent: "space-between", // Adjust as needed
                    padding: "10px",
                    marginTop: "-16px",
                    fontSize: "12px",
                    gap: "25px",
                    border: "1px solid black",
                    borderTop: "0",
                  }}
                >
                  <div>
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
                    className=''
                    style={{
                      borderLeft: "1px solid black",
                      paddingLeft: "10px",
                    }}
                  >
                    <p>
                      12%: SGST 191.04, CGST 191.04 ={" "}
                      {((totals.total || 0) * 0.06).toFixed(2)} /{" "}
                      {totals.total?.toFixed(2) || "0.00"}
                    </p>

                    <p
                      style={{
                        borderTop: "1px solid black",
                        paddingLeft: "5px",
                        paddingTop: "15px",
                        borderTopStyle: "dashed",
                      }}
                    >
                      SGST AMT 191.04, CGST AMT : 191.04{" "}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      borderLeft: "1px solid black",
                      paddingLeft: "35px",
                    }}
                  >
                    <h5>Bill Amount (R): {invoice.finalAmount?.toFixed(2)}</h5>
                    {/* <p
                      style={{
                        borderTop: "1px dashed black",
                        paddingTop: "5px",
                      }}
                    >
                      For: ADARSH AGENCY
                    </p>
                    <p style={{ marginTop: "20px", marginBottom: "10px" }}>
                      Authorized Signatory
                    </p>
                    {invoice.finalAmount > 0 && (
                      <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                        Rs.{" "}
                        {toWords(Math.floor(invoice.finalAmount)).replace(
                          /\b\w/g,
                          (l) => l.toUpperCase()
                        )}{" "}
                        Only
                      </p>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateInvoice;

//! ------------------------------------
