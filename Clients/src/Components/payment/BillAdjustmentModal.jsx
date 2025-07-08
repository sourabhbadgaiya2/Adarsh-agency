import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { Modal, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Config/axios";

const BillAdjustmentModal = forwardRef(
  (
    {
      show,
      onHide,
      amount,
      openPendingModal,
      selectedVendorId,
      onPendingChange,
    },
    ref
  ) => {
    const [rows, setRows] = useState([
      {
        type: "Adj Ref",
        particulars: "",
        dueDays: "",
        amount: "",
        remark: "",
        balance: "",
      },
    ]);

    console.log(selectedVendorId, "LION");

    const [focusedRowIndex, setFocusedRowIndex] = useState(null);
    const [cashDiscount, setCashDiscount] = useState(0);

    const selectRef = useRef(); // Ref for first dropdown

    const navigate = useNavigate();

    // 🔁 Reset rows when modal is closed
    useEffect(() => {
      if (!show) {
        setRows([
          {
            type: "Adj Ref",
            particulars: "",
            dueDays: "",
            amount: "",
            remark: "",
            balance: "",
          },
        ]);
      }
    }, [show]);

    // 🔁 On modal open, auto-focus and open dropdown
    useEffect(() => {
      if (show && selectRef.current) {
        setTimeout(() => {
          selectRef.current.focus();

          // Simulate ArrowDown key to open dropdown visually
          const event = new KeyboardEvent("keydown", {
            key: "ArrowDown",
            bubbles: true,
          });
          selectRef.current.dispatchEvent(event);
        }, 100);
      }
    }, [show]);

    // 🔁 Expose method to parent to insert bill
    useImperativeHandle(ref, () => ({
      // insertBill: (rowIndex, bill) => {
      //   const updated = [...rows];
      //   updated[rowIndex].particulars = bill.particulars;
      //   updated[rowIndex].amount = bill.pending;
      //   updated[rowIndex].balance = bill.pending;
      //   setRows(updated);
      // },

      insertBill: (rowIndex, { bill, itemId, enteredAmount }) => {
        const updated = [...rows];
        updated[rowIndex] = {
          ...updated[rowIndex],
          particulars: `Bill #${bill.entryNumber}`,
          amount: enteredAmount,
          balance: bill.pendingAmount,
          purchaseEntryId: bill._id,
          itemId: itemId,
        };
        setRows(updated);
      },
    }));

    const handleChange = (index, field, value) => {
      const updated = [...rows];

      updated[index][field] = value;

      // ✅ If type is changed to "New Ref", set amount = pending
      if (field === "type" && value === "New Ref") {
        const pendingAmount = amount - totalAdjusted;

        if (pendingAmount > 0) {
          updated[index].amount = pendingAmount.toFixed(2);
        }
      }

      setRows(updated);
    };

    const handleKeyDown = (e, index) => {
      const selectedType = rows[index].type;

      if (e.key === "Enter") {
        e.preventDefault();

        if (selectedType === "Adj Ref") {
          openPendingModal(index); // ✅ Open pending bills modal
        }

        if (selectedType === "New Ref" || selectedType === "Clear") {
          const pendingAmount = amount - totalAdjusted;
          console.log(pendingAmount, "Before");

          if (pendingAmount <= 0) {
            alert("Nothing to adjust.");
            return;
          }
          console.log(pendingAmount, "after");

          console.log(selectedVendorId, "Payload");

          const payload = {
            amount: Number(pendingAmount.toFixed(2)),
            vendorId: selectedVendorId,
          };

          fetch(
            "https://aadarshagency.onrender.com/api/purchase/adjust-vendor-direct",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          )
            .then((res) => {
              if (!res.ok) throw new Error("Failed");
              alert("✅ Amount adjusted successfully");

              const updated = [...rows];
              updated[index].particulars = "New Ref Adjustment";
              updated[index].amount = pendingAmount.toFixed(2);
              updated[index].balance = 0;
              setRows(updated);
            })
            .catch((err) => {
              console.error(err);
              alert("❌ Failed to adjust amount");
            });
        }
      }
    };

    const totalAdjusted = rows.reduce((sum, row) => {
      const amt = parseFloat(row.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    // const handleSave = async () => {
    //   console.log("📦 Saving payload:", selectedVendorId, pending);

    //   const payload = {
    //     vendorId: selectedVendorId,
    //     amount: Number(pending),
    //   };

    //   try {
    //     const res = await fetch(
    //       "http://localhost:8080/api/purchase/adjust-vendor-direct",
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(payload),
    //       }
    //     );

    //     if (!res.ok) throw new Error("Server error");

    //     alert("Payment adjusted successfully");
    //     onHide();
    //     navigate("/ledger");
    //   } catch (error) {
    //     console.error("Error saving adjustment:", error);
    //     // alert("Failed to save adjustment");
    //   }
    // };

    const handleSave = async () => {
      console.log("📦 Saving payload:", selectedVendorId, pending);

      const payload = {
        vendorId: selectedVendorId,
        amount: Number(pending),
      };

      try {
        const res = await axiosInstance.post(
          "/purchase/adjust-vendor-direct",
          payload
        );

        if (res.status !== 200) throw new Error("Server error");

        alert("✅ Payment adjusted successfully");
        onHide();
        navigate("/ledger");
      } catch (error) {
        console.error("❌ Error saving adjustment:", error.message);
        alert("Failed to save adjustment");
      }
    };

    const pending = amount - totalAdjusted;

    useEffect(() => {
      const pending = amount - totalAdjusted;
      if (onPendingChange) {
        onPendingChange(Number(pending.toFixed(2)));
      }
    }, [rows, amount, totalAdjusted, onPendingChange]);

    return (
      <Modal show={show} onHide={onHide} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Bill Adjustment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Amount:</strong> ₹{amount.toFixed(2)} Dr
          </p>

          <Table bordered size='sm'>
            <thead>
              <tr>
                <th>Type</th>
                <th>Particulars</th>
                <th>Due Days</th>
                <th>Amount</th>
                <th>Remark</th>
                <th>Balance</th>
              </tr>
            </thead>
            {/* <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <Form.Control
                      as='select'
                      ref={idx === 0 ? selectRef : null} // auto-focus only first
                      value={row.type || ""}
                      onFocus={() => setFocusedRowIndex(idx)}
                      onChange={(e) =>
                        handleChange(idx, "type", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                    >
                      <option value='Adj Ref'>Adj Ref</option>
                      <option value='New Ref'>New Ref</option>
                      <option value='Clear'>Clear</option>
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      value={row.particulars || ""}
                      onChange={(e) =>
                        handleChange(idx, "particulars", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type='number'
                      value={row.dueDays || ""}
                      onChange={(e) =>
                        handleChange(idx, "dueDays", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type='number'
                      value={row.amount || ""}
                      onChange={(e) =>
                        handleChange(idx, "amount", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={row.remark || ""}
                      onChange={(e) =>
                        handleChange(idx, "remark", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      value={row.balance || ""}
                      onChange={(e) =>
                        handleChange(idx, "balance", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody> */}

            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {/* TYPE */}
                  <td>
                    <Form.Control
                      as='select'
                      ref={idx === 0 ? selectRef : null}
                      value={row.type || ""}
                      onFocus={() => setFocusedRowIndex(idx)}
                      onChange={(e) =>
                        handleChange(idx, "type", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                    >
                      <option value='Adj Ref'>Adj Ref</option>
                      <option value='New Ref'>New Ref</option>
                      <option value='Clear'>Clear</option>
                    </Form.Control>
                  </td>

                  {/* PARTICULARS */}
                  <td>
                    <Form.Control
                      value={row.particulars || ""}
                      onChange={(e) =>
                        handleChange(idx, "particulars", e.target.value)
                      }
                      disabled={row.type === "New Ref"}
                    />
                  </td>

                  {/* DUE DAYS */}
                  <td>
                    <Form.Control
                      type='number'
                      value={row.dueDays || ""}
                      onChange={(e) =>
                        handleChange(idx, "dueDays", e.target.value)
                      }
                      disabled={row.type === "New Ref"}
                    />
                  </td>

                  {/* AMOUNT INPUT — ENABLE only for "New Ref" */}
                  <td>
                    <Form.Control
                      type='number'
                      value={row.amount || ""}
                      onChange={(e) =>
                        handleChange(idx, "amount", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      placeholder={
                        row.type === "New Ref" ? "Enter amount to adjust" : ""
                      }
                      disabled={row.type !== "New Ref"}
                    />
                  </td>

                  {/* REMARK */}
                  <td>
                    <Form.Control
                      value={row.remark || ""}
                      onChange={(e) =>
                        handleChange(idx, "remark", e.target.value)
                      }
                      disabled={row.type === "New Ref"}
                    />
                  </td>

                  {/* BALANCE */}
                  <td>
                    <Form.Control
                      value={row.balance || ""}
                      onChange={(e) =>
                        handleChange(idx, "balance", e.target.value)
                      }
                      disabled={row.type === "New Ref"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className='d-flex justify-content-between mt-3'>
            <span>
              <strong>Adjusted:</strong> ₹{totalAdjusted.toFixed(2)} Dr
            </span>
            <span>
              <strong>Pending:</strong> ₹{pending.toFixed(2)} Dr
            </span>
          </div>

          <Modal.Footer>
            <button
              className='btn btn-primary'
              onClick={handleSave}
              disabled={rows.length === 0}
            >
              Save
            </button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    );
  }
);

export default BillAdjustmentModal;
