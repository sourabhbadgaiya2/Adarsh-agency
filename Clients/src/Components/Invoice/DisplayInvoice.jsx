import React, { useEffect, useState } from "react";
import axios from "../../Config/axios";
// import { Table, Button } from "react-bootstrap";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

import useSearchableModal from "../../Components/SearchableModal"; // adjust path if needed

const DisplayInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const processedInvoices = invoices.map((inv) => {
    const customer = inv.customer || {};
    const billing = Array.isArray(inv.billing) ? inv.billing : [];
    const itemNames = billing.map((b) => b.itemName).join(" ");
    const totalAmount = inv.finalAmount || 0;

    const combinedSearchText = [
      customer.CustomerName,
      customer.paymentMode,
      customer.salesmanName,
      itemNames,
      totalAmount,
      inv.billingType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return {
      ...inv,
      searchText: combinedSearchText,
    };
  });

  const {
    showModal,
    setShowModal,
    filterText,
    setFilterText,
    focusedIndex,
    setFocusedIndex,
    inputRef,
    rowRefs,
    filteredItems,
  } = useSearchableModal(processedInvoices, "searchText"); // ✅ Now all fields searchable!

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing");
      setInvoices(response.data);
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (invoiceId) => {
    navigate(`/generate-invoice/${invoiceId}`);
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    setLoading(true);

    try {
      await axios.delete(`/pro-billing/${invoiceId}`);
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to delete invoice");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Handle F10, Arrow Keys, Enter
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === "F10") {
  //       e.preventDefault();
  //       setShowModal(true);
  //       setFocusedIndex(0);
  //     }

  //     if (showModal) {
  //       if (e.key === "ArrowDown") {
  //         e.preventDefault();
  //         setFocusedIndex(
  //           (prev) => (prev < visibleItems.length - 1 ? prev + 1 : prev) // ✅ use visibleItems
  //         );
  //       }

  //       if (e.key === "ArrowUp") {
  //         e.preventDefault();
  //         setFocusedIndex(
  //           (prev) => (prev > 0 ? prev - 1 : 0) // ✅ safe fallback
  //         );
  //       }

  //       if (e.key === "Enter") {
  //         e.preventDefault();
  //         const selected = visibleItems[focusedIndex]; // ✅ NEW: use visibleItems
  //         if (selected) {
  //           navigate(`/generate-invoice/${selected._id}`);
  //           setShowModal(false);
  //         }
  //       }

  //       if (e.key === "Escape") {
  //         e.preventDefault();
  //         setShowModal(false);
  //       }
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [showModal, filteredItems, focusedIndex]);

  const visibleItems = filterText.trim() === "" ? invoices : filteredItems;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F10") {
        e.preventDefault();

        setShowModal(true);
        setFocusedIndex(0);

        // Delay focus on inputRef to ensure it's ready
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 50);
      }

      if (showModal) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < visibleItems.length - 1 ? prev + 1 : prev
          );
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }

        if (e.key === "Enter") {
          e.preventDefault();
          const selected = visibleItems[focusedIndex];
          if (selected) {
            navigate(`/generate-invoice/${selected._id}`);
            setShowModal(false);
          }
        }

        if (e.key === "Escape") {
          e.preventDefault();
          setShowModal(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, visibleItems, focusedIndex]);

  if (loading) {
    return <Loader />;
  }

  console.log(visibleItems, "LIONMs");

  return (
    <div className='w-full mt-4 px-3'>
      <h2 className='mb-4'>All Invoices</h2>

      <div style={{ overflowX: "auto" }}>
        <Table
          striped
          bordered
          hover
          responsive
          style={{ tableLayout: "fixed", minWidth: "900px" }}
        >
          <thead className='bg-light sticky-top' style={{ top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ width: "120px" }}>Date</th>
              <th>Item Purchased</th>
              <th>Quantity</th>
              <th>Free</th>
              <th>Total Qty</th>
              <th>Total Price</th>
              <th>Print</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => {
              const { customer = {}, billing = [] } = invoice;

              return (
                <tr key={invoice._id}>
                  <td>
                    {customer.Billdate
                      ? new Date(customer.Billdate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {item.itemName || "-"}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {item.qty || 0} {item.unit || ""}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {item.Free || 0}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {(item.qty || 0) + (item.Free || 0)}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>{invoice.finalAmount || 0}</td>

                  <td>
                    <Button
                      variant='outline-primary'
                      size='sm'
                      onClick={() => handlePrint(invoice._id)}
                    >
                      Print
                    </Button>
                  </td>

                  <td>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      onClick={() => handleDelete(invoice._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* 🔍 Searchable Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Search Invoices</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type='text'
            placeholder='Search by customer name...'
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            ref={inputRef}
          />

          <div
            style={{ maxHeight: "400px", overflowY: "auto", marginTop: "1rem" }}
          >
            <Table hover size='sm' bordered>
              <thead>
                <tr>
                  <th>Customer Name</th> {/* ✅ NEW */}
                  <th style={{ width: "120px" }}>Date</th>
                  <th>Item Purchased</th>
                  <th>Quantity</th>
                  <th>Free</th>
                  <th>Total Qty</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className='text-center text-muted'>
                      No invoices found
                    </td>
                  </tr>
                )}

                {visibleItems.map((invoice, i) => {
                  const billing = Array.isArray(invoice.billing)
                    ? invoice.billing
                    : [];
                  const customer = invoice.customer || {};

                  return (
                    <tr
                      key={invoice._id}
                      ref={(el) => (rowRefs.current[i] = el)} // ✅ correct ref
                      className={i === focusedIndex ? "table-active" : ""} // ✅ Bootstrap class
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/generate-invoice/${invoice._id}`);
                        setShowModal(false);
                      }}
                    >
                      <td>{customer.CustomerName || "-"}</td> {/* ✅ NEW */}
                      <td>
                        {customer.Billdate
                          ? new Date(customer.Billdate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {billing.map((item, idx) => (
                          <div key={idx}>{item.itemName || "-"}</div>
                        ))}
                      </td>
                      <td>
                        {billing.map((item, idx) => (
                          <div key={idx}>
                            {item.qty || 0} {item.unit || ""}
                          </div>
                        ))}
                      </td>
                      <td>
                        {billing.map((item, idx) => (
                          <div key={idx}>{item.Free || 0}</div>
                        ))}
                      </td>
                      <td>
                        {billing.map((item, idx) => (
                          <div key={idx}>
                            {(item.qty || 0) + (item.Free || 0)}
                          </div>
                        ))}
                      </td>
                      <td>{invoice.finalAmount || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
};

export default DisplayInvoice;
