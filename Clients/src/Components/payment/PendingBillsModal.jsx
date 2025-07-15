import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/axios";
import { payAgainstPurchase } from "../../redux/features/purchase/purchaseThunks";
import { useDispatch } from "react-redux";

const PendingBillsModal = ({
  show,
  onHide,
  onBillSelect,
  bills = [],
  amountBill,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pendingBills = bills;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      setSelectedIndex(0);
    }
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
          console.log("Selected Bill ID:", selected._id.$oid); // 👈 Console me I
          // onBillSelect(selected);
          onBillSelect(selected._id.$oid); // Sirf ID bhejna ho to
          onHide();
        }
      } else if (e.key === "Escape") {
        onHide();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, selectedIndex, onBillSelect, onHide, pendingBills]);

  const columns = [
    {
      name: "INVOICE NO.",
      selector: (row) => row.invoiceNumber || row.entryNumber || "N/A",
      sortable: true,
    },
    {
      name: "INV_AMOUNT",
      selector: (row) => row?.pendingAmount || 0,
      sortable: true,
      cell: (row) => `₹ ${row?.pendingAmount || 0}`,
      right: true,
    },
    {
      name: "BILL DATE",
      selector: (row) => row.billDate || "N/A", // assuming billDate is in YYYY-MM-DD
      sortable: true,
    },
    {
      name: "BILL DATE",
      selector: (row) => {
        if (row.billDate) return row.billDate;

        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        return `${day}-${month}-${year}`;
      },
      sortable: true,
    },
    {
      name: "DUE DATE",
      selector: (row) => row.dueDate || "N/A", // assume dueDate field
      sortable: true,
    },

    {
      name: "AMOUNT",
      cell: (row) => (
        <button
          className='btn btn-sm btn-primary'
          onClick={() => {
            handleSave(row._id);
            onHide();
          }}
        >
          Select
        </button>
      ),
      center: true,
    },
  ];

  const handleSave = async (id) => {
    console.log("📦 Saving payload:", id, amountBill);

    const payload = {
      vendorId: id,
      amount: Number(amountBill),
    };

    try {
      // const res = await axiosInstance.post(
      //   "/purchase/update-pending-amount",
      //   payload
      // );

      // Somewhere in your React Component

      await dispatch(
        payAgainstPurchase({ purchaseId: id, amount: Number(amountBill) })
      )
        .unwrap()
        .then((res) => {
          console.log("✅ Payment Success:", res);
          alert("Payment Done!");
        })
        .catch((err) => {
          console.error("❌ Payment Error:", err);
          alert(err);
        });

      alert("Payment adjusted successfully");
      onHide();
      navigate("/");
    } catch (error) {
      console.error("Error saving adjustment:", error);
      alert("Failed to save adjustment");
    }
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Pending Bills</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pendingBills.length > 0 ? (
          <DataTable
            columns={columns}
            data={pendingBills}
            highlightOnHover
            pointerOnHover
            selectableRowsHighlight
            defaultSortFieldId={1}
            pagination
          />
        ) : (
          <p>No pending bills available for this vendor.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PendingBillsModal;
