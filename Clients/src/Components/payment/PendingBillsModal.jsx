import React, { useEffect, useState } from "react";
import { Modal, ListGroup } from "react-bootstrap";

const PendingBillsModal = ({ show, onHide, onBillSelect, bills = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pendingBills = bills;

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
          onBillSelect(selected);
          onHide();
        }
      } else if (e.key === "Escape") {
        onHide();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, selectedIndex, onBillSelect, onHide, pendingBills]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pending Bills</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pendingBills.length > 0 ? (
          <ListGroup>
            {pendingBills.map((bill, idx) => {
              console.log(bill, "LION");
              return (
                <ListGroup.Item
                  key={bill._id}
                  active={idx === selectedIndex}
                  action
                  onClick={() => {
                    onBillSelect(bill);
                    onHide();
                  }}
                >
                  {bill.entryNumber || bill.partyNo || "Bill"} – ₹
                  {bill.items?.[0]?.totalAmount?.toLocaleString() || 0}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <p>No pending bills available for this vendor.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PendingBillsModal;
