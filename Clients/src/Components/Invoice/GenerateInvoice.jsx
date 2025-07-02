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
      acc.totalQty = (acc.totalQty || 0) + (parseFloat(item.qty) || 0);
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

  const itemsPerPage = 14;
  const billingChunks = chunkArray(billing, itemsPerPage);

  // Utility to group by GST %
  const gstSummary = billing.reduce((acc, item) => {
    const product = productDetails[item.productId?._id] || {};
    const gst = product?.gstPercent || 0;
    const amount = parseFloat(item.total) || 0;
    const taxableAmt = (amount * 100) / (100 + gst); // to remove GST from total

    if (!acc[gst]) {
      acc[gst] = {
        taxable: 0,
        sgst: 0,
        cgst: 0,
      };
    }

    acc[gst].taxable += taxableAmt;
    acc[gst].sgst += (taxableAmt * gst) / 2 / 100;
    acc[gst].cgst += (taxableAmt * gst) / 2 / 100;

    return acc;
  }, {});

  if (loading) return <Loader />;

  return (
    <div>
      <div className='container  d-print-none'>
        {/* <select
          value={printOrientation}
          onChange={(e) => setPrintOrientation(e.target.value)}
          className='form-select mb-3'
        >
          <option value='portrait'>Portrait</option>
          <option value='landscape'>Landscape</option>
        </select> */}

        <button
          onClick={() => window.print()}
          className='btn btn-primary my-3 d-print-none'
        >
          Print Invoice
        </button>
      </div>

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            #print-area, #print-area * {
              visibility: visible;
              font-family: "Courier New", monospace;
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

            .invoice-page:not(:last-child) {
              page-break-after: always;
            }

            @page {
              size: A4;
              margin:3mm;
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
      </style>

      <div id='print-area'>
        {billingChunks.map((chunk, pageIndex) => (
          <div
            key={pageIndex}
            className='invoice-page'
            style={{
              // width: "210mm",
              margin: "auto",
              padding: "1mm",
              fontFamily: "Courier New monospace",

              fontSize: "12px",
            }}
          >
            <div>
              <div
                style={{
                  borderBottom: "1px dashed black",
                  paddingBottom: "1px",
                  marginBottom: "1px",
                  marginTop: "0px",
                }}
              >
                <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>
                  <strong>GSTIN: 23BJUPR9537F1ZK</strong>
                </p>

                <h2
                  style={{
                    //fontWeight: "bold",
                    fontSize: "22px",
                    textAlign: "center",
                    margin: "-3px",
                  }}
                >
                  SAMRIDDHI ENTERPRISES
                </h2>

                <p
                  style={{
                    margin: "0",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  H.NO.02, NAGAR NIGAM COLONY, TIMBER MARKET, CHHOLA, BHOPAL
                </p>
                <p
                  style={{
                    margin: "-3px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  MOB: 9926793332, 9893315590
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 0,
                  padding: 0,
                  fontSize: "12px",
                  // fontFamily: "monospace",
                  lineHeight: "1.2",
                }}
              >
                <div
                  style={{
                    width: "75%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  <strong>
                    {" "}
                    <span>{fullCustomer?.ledger || "N/A"}</span>
                  </strong>
                  <span>{fullCustomer?.address1 || "N/A"}</span>
                  <span>{fullCustomer?.mobile || "N/A"}</span>
                  <strong style={{ textAlign: "center", marginTop: "-13px" }}>
                    GSTIN: {fullCustomer?.gstNumber || "N/A"}
                  </strong>
                </div>

                <div
                  style={{
                    textAlign: "left",
                    width: "25%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  <span>
                    <strong>
                      Bill No:
                      <span style={{ fontSize: "17px", fontWeight: "300" }}>
                        {invoice._id?.slice(-6)}
                      </span>
                    </strong>
                  </span>
                  <span>
                    <strong>Date:</strong>
                    {new Date(customer?.Billdate).toLocaleDateString("en-GB")}
                    &nbsp; {invoice?.billingType}
                  </span>

                  <span>
                    <strong>Salesman:</strong>
                    &nbsp; {salesmanId?.name || "N/A"} &nbsp;
                    {salesmanId?.mobile || "-"}
                  </span>
                </div>
              </div>

              <Table
                bordered
                className='mt-1 table-sm'
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
                          padding: "2px",
                          textAlign: "center",
                          paddingLeft: i === 1 ? "5px" : "2px",
                          paddingRight: i === 1 ? "5px" : "2px",
                          fontWeight: "400",
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
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            textAlign: "center",
                            padding: "2px",
                          }}
                        >
                          {pageIndex * itemsPerPage + index + 1}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "left",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                          }}
                        >
                          {item.itemName || "N/A"}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {product.hsnCode || "N/A"}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {product.mrp || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.qty || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.Free || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.rate || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.sch || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.schAmt || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.cd || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.total || 0}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {gst / 2}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {gst / 2}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          {item.amount || 0}
                        </td>
                      </tr>
                    );
                  })}

                  {chunk.length > 0 && (
                    <tr style={{ borderBottom: "1px solid black" }}>
                      <td
                        colSpan={14}
                        style={{ height: "1px", padding: 0 }}
                      ></td>
                    </tr>
                  )}

                  {chunk.length < itemsPerPage &&
                    Array.from({ length: itemsPerPage - chunk.length }).map(
                      (_, i) => <tr key={`empty-${i}`}></tr>
                    )}

                  {pageIndex === billingChunks.length - 1 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td className='border border-black p-1'></td>
                      <td className='border border-black p-1' colSpan={1}>
                        Basic Amount: {totals.total?.toFixed(2) || "0.00"}
                      </td>
                      <td
                        className='p-1'
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                        }}
                      >
                        QTY:{" "}
                      </td>
                      <td
                        className='p-1'
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                        }}
                      >
                        C/S 0
                      </td>
                      <td
                        className='p-1'
                        style={{
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        PCS : {totals.totalQty || 0}
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1'
                      >
                        0
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1'
                      ></td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1'
                      ></td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1'
                      >
                        {billing
                          .reduce(
                            (sum, item) => sum + (parseFloat(item.schAmt) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1 '
                      ></td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1'
                      >
                        {totals.total?.toFixed(2) || "0.00"}
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1'
                      >
                        {((totals.total || 0) * 0.06).toFixed(2)}
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1'
                      >
                        {totals.cgst?.toFixed(2) || "0.00"}
                      </td>
                      <td
                        style={{ textAlign: "right" }}
                        className='border border-black p-1 '
                      >
                        {invoice.finalAmount?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {pageIndex < billingChunks.length - 1 && (
                <div
                  className='invoice-footer '
                  style={{
                    display: "flex",
                    padding: "5px",
                    paddingBottom: "0",
                    marginTop: "-16px",
                    fontSize: "11px",
                    gap: "6px",
                    border: "1px solid black",
                    borderTop: "0",
                    width: "100%",
                  }}
                >
                  <div>
                    <p style={{ marginBottom: "0" }}>
                      Goods once sold will not be taken back
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      Cheque bounce charges Rs. 500/-
                    </p>
                    <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
                    <p style={{ marginBottom: "0" }}>
                      Subject to Bhopal jurisdiction/-
                    </p>
                    <p style={{ marginBottom: "0" }}>E.&.O.E</p>
                  </div>

                  <div
                    className=''
                    style={{
                      borderLeft: "1px solid black",
                      paddingLeft: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be
                      continued...
                      <span style={{ display: "block", textAlign: "right" }}>
                        Page {pageIndex + 1} of {billingChunks.length}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {pageIndex === billingChunks.length - 1 && (
                <div
                  className='invoice-footer '
                  style={{
                    display: "flex",
                    padding: "5px",
                    paddingBottom: "0",
                    marginTop: "-16px",
                    fontSize: "11px",
                    gap: "6px",
                    border: "1px solid black",
                    borderTop: "0",
                    width: "100%",
                  }}
                >
                  <div>
                    <p style={{ marginBottom: "0" }}>
                      Goods once sold will not be taken back
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      Cheque bounce charges Rs. 500/-
                    </p>
                    <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
                    <p style={{ marginBottom: "0" }}>
                      Subject to Bhopal jurisdiction/-
                    </p>
                    <p>E.&.O.E</p>
                  </div>
                  {/* //!SGST */}
                  <div
                    className=''
                    style={{
                      borderLeft: "1px solid black",
                      paddingLeft: "10px",
                      margin: "0",
                    }}
                  >
                    {Object.entries(gstSummary).map(([rate, value]) => (
                      <p style={{ margin: "0", padding: "2px" }} key={rate}>
                        {rate}%: SGST {value.sgst.toFixed(2)}, CGST{" "}
                        {value.cgst.toFixed(2)} ={" "}
                        {(value.sgst + value.cgst).toFixed(2)} /{" "}
                        {value.taxable.toFixed(2)}
                      </p>
                    ))}
                    <p
                      style={{
                        borderTop: "1px solid black",
                        paddingLeft: "5px",
                        paddingTop: "8px",
                        borderTopStyle: "dashed",
                      }}
                    >
                      SGST AMT{" "}
                      {Object.values(gstSummary)
                        .reduce((sum, val) => sum + val.sgst, 0)
                        .toFixed(2)}
                      , CGST AMT :{" "}
                      {Object.values(gstSummary)
                        .reduce((sum, val) => sum + val.cgst, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div
                    style={{
                      width: "32%",
                      textAlign: "",
                      borderLeft: "1px solid black",
                      paddingLeft: "6px",
                      fontSize: "13px",
                      position: "relative",
                    }}
                  >
                    <h5
                      style={{
                        width: "100%",
                        fontSize: "14px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "15px",
                      }}
                    >
                      <span>Bill Amount (R):</span>
                      <span
                        style={{
                          textAlign: "right",
                        }}
                      >
                        {invoice.finalAmount?.toFixed(2)}
                      </span>
                    </h5>
                    <span
                      style={{
                        textAlign: "right",
                        position: "absolute",
                        bottom: "5px",
                        right: "0",
                      }}
                    >
                      Page {pageIndex + 1} of {billingChunks.length}
                    </span>
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
