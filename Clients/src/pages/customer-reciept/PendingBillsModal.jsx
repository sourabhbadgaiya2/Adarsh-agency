
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/axios";
import Header from "./Header";
// import "./PendingBillsModal.css"; // ✅ Make sure you create this file

const dummyInvoices = [
  {
    _id: "A000137",
    invoiceNo: "A000137",
    pendingAmount: 29110,
    type: "Dr",
    billDate: "2025-04-17",
    dueDate: "2025-04-17",
  },
  {
    _id: "A000136",
    invoiceNo: "A000136",
    pendingAmount: 137226,
    type: "Dr",
    billDate: "2025-04-30",
    dueDate: "2025-04-30",
  },
  {
    _id: "CALLIM",
    invoiceNo: "CALLIM",
    pendingAmount: 1163,
    type: "Cr",
    billDate: "2025-05-01",
    dueDate: "2025-05-30",
  },
  {
    _id: "X123",
    invoiceNo: "465100422",
    pendingAmount: 62221.42,
    type: "Cr",
    billDate: "2025-04-30",
    dueDate: "2025-05-30",
  },
  {
    _id: "X124",
    invoiceNo: "465100447",
    pendingAmount: 194627.0,
    type: "Dr",
    billDate: "2025-05-16",
    dueDate: "2025-05-28",
  },
];

const PendingBillsModal = ({
  show,
  onHide,
  onBillSelect,
  bills = [],
  amountBill,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const pendingBills = bills.invoices?.length ? bills.invoices : dummyInvoices;

  useEffect(() => {
    if (show) setSelectedIndex(0);
  }, [show]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!show || pendingBills.length === 0) return;
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % pendingBills.length);
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0 ? pendingBills.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        const selected = pendingBills[selectedIndex];
        if (selected) {
          onBillSelect(selected._id);
          onHide();
        }
      } else if (e.key === "Escape") {
        onHide();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, selectedIndex, pendingBills]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  const handleSave = async (id) => {
    const payload = {
      invoiceId: id,
      amount: Number(amountBill),
    };
    try {
      const res = await axiosInstance.post("/pro-billing/adjust", payload);
      alert("Payment adjusted successfully");
      onHide();
      navigate(`/`);
    } catch (error) {
      console.error("Error saving adjustment:", error);
      alert("Failed to save adjustment");
    }
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen>

      <Header />
      <Modal.Header
        style={{ backgroundColor: "#3C6360" }}
        closeButton
        className='bg-bg-success'
      >
        <Modal.Title className='text-white'>PENDING INVOICE</Modal.Title>
      </Modal.Header>
      <Modal.Body className='pending-modal-body'>
        <div className='pending-table-wrapper'>
          <div className='pending-table-header'>

      <Header/>
      <Modal.Header style={{ backgroundColor:"#3C6360" }} closeButton className="bg-bg-success">
        <Modal.Title className="text-white">PENDING INVOICE</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pending-modal-body">
        <div className="pending-table-wrapper">
          <div className="pending-table-header">

            <span>INVOICE NO.</span>
            <span>INV. AMOUNT</span>
            <span>BILL DATE</span>
            <span>DUE DATE</span>
            <span>DAYS</span>
            <span>BALANCE</span>
            <span>AMOUNT</span>
          </div>
          {pendingBills.length > 0 ? (
            pendingBills.map((bill, index) => {
              const isSelected = index === selectedIndex;
              const balance = bill?.pendingAmount || 0;
              const daysDiff = (() => {
                const billDate = new Date(bill?.billDate);
                const dueDate = new Date(bill?.dueDate);

                const diff = Math.floor(
                  (dueDate - billDate) / (1000 * 60 * 60 * 24)
                );

                const diff = Math.floor((dueDate - billDate) / (1000 * 60 * 60 * 24));

                return isNaN(diff) ? "-" : diff;
              })();
              return (
                <div
                  key={bill._id}
                  className={`pending-row ${isSelected ? "active-row" : ""}`}
                >
                  <span>{bill?.invoiceNo}</span>

                  <span>
                    {balance.toFixed(2)} {bill?.type}
                  </span>
                  <span>{formatDate(bill?.billDate)}</span>
                  <span>{formatDate(bill?.dueDate)}</span>
                  <span>{daysDiff}</span>
                  <span>
                    {balance.toFixed(2)} {bill?.type}
                  </span>
                  <span>
                    <button
                      className='select-btn'

                  <span>{balance.toFixed(2)} {bill?.type}</span>
                  <span>{formatDate(bill?.billDate)}</span>
                  <span>{formatDate(bill?.dueDate)}</span>
                  <span>{daysDiff}</span>
                  <span>{balance.toFixed(2)} {bill?.type}</span>
                  <span>
                    <button
                      className="select-btn"

                      onClick={() => {
                        handleSave(bill._id);
                        onHide();
                      }}
                    >
                      SELECT
                    </button>
                  </span>
                </div>
              );
            })
          ) : (

            <div className='pending-empty'>No pending bills available.</div>

            <div className="pending-empty">No pending bills available.</div>

          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PendingBillsModal;
