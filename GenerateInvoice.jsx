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
            }

            .d-print-none {
              display: none !important;
            }

            .invoice-page:not(:last-child) {
              page-break-after: always;
            }

            @page {
              size: A5;
              margin:0;
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
              width: "210mm",
              margin: "auto",
              padding: "1mm",
              fontFamily: "monospace",
              fontSize: "12px",
            }}
          >
            <div>
              <div
                style={{
                  borderBottom: "2px dashed black",
                  paddingBottom: "4px",
                  marginBottom: "1px",
                  marginTop: "0px",
                }}
              >
                <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>
                  <strong>GSTIN: 23BJUPR9537F1ZK</strong>
                </p>

                <h2
                  style={{
                    fontWeight: "bold",
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
                  marginTop: "0px",
                  paddingBottom: "0px",
                  fontSize: "13px",
                  fontFamily: "monospace",
                }}
              >
                <div style={{ width: "35.2%" }}>
                  {fullCustomer?.ledger || "N/A"} <br />
                  {fullCustomer?.address1 || "N/A"}&nbsp;
                  {fullCustomer?.mobile || "N/A"} <br />
                  <strong>GSTIN:</strong> {fullCustomer?.gstNumber || "N/A"}
                </div>
                <div style={{ textAlign: "right", width: "48%" }}>
                  <strong>Bill No:</strong>{" "}
                  <span>{invoice._id?.slice(-6)}</span> <br />
                  <strong>Date:</strong>{" "}
                  {new Date(customer?.Billdate).toLocaleDateString("en-GB")}
                  <strong style={{ fontWeight: "bold", fontSize: "15px" }}>
                    {" "}
                    {invoice.billingType}
                  </strong>
                  <br />
                  <strong>Salesman:</strong> {salesmanId?.name || "N/A"} <br />
                  <strong>Number:</strong> {salesmanId?.mobile || "-"}
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
                          className=''
                          style={{
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                          }}
                        >
                          {pageIndex * itemsPerPage + index + 1}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.itemName || "N/A"}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {product.hsnCode || "N/A"}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {product.mrp || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.qty || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.Free || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.rate || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.sch || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.schAmt || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.cd || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {item.total || 0}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {gst / 2}
                        </td>
                        <td
                          style={{ borderRight: "1px solid black" }}
                          className=''
                        >
                          {gst / 2}
                        </td>
                        <td
                          className=''
                          style={{ borderRight: "1px solid black" }}
                        >
                          {item.amount || 0}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Added border row after entries */}
                  {chunk.length > 0 && (
                    <tr style={{ borderBottom: '2px solid black' }}>
                      <td colSpan={14} style={{ height: '1px', padding: 0 }}></td>
                    </tr>
                  )}

                  {/* Fill empty rows if needed */}
                  {chunk.length < itemsPerPage &&
                    Array.from({ length: itemsPerPage - chunk.length }).map(
                      (_, i) => <tr key={`empty-${i}`}></tr>
                    )}

                  {/* Totals row only on the last page */}
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
                        }}
                      >
                        PCS : {totals.totalQty || 0}
                      </td>
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

              {pageIndex < billingChunks.length - 1 && (
                <div className='to-be-continued'>To be continued...</div>
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
                      textAlign: "",
                      borderLeft: "1px solid black",
                      paddingLeft: "6px",
                      fontSize: "2px",
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "14px",
                        fontFamily: "bold",
                      }}
                    >
                      Bill Amount (R): {invoice.finalAmount?.toFixed(2)}
                    </h5>
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