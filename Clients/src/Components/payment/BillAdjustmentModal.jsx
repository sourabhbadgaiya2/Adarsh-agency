import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { Modal, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BillAdjustmentModal = forwardRef(
  ({ show, onHide, amount, openPendingModal }, ref) => {
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

    const [focusedRowIndex, setFocusedRowIndex] = useState(null);

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
      insertBill: (rowIndex, bill) => {
        const updated = [...rows];
        updated[rowIndex].particulars = bill.particulars;
        updated[rowIndex].amount = bill.pending;
        updated[rowIndex].balance = bill.pending;
        setRows(updated);
      },
    }));

    const handleChange = (index, field, value) => {
      const updated = [...rows];
      updated[index][field] = value;
      setRows(updated);
    };

    // 🔁 Only open modal when Enter is pressed & "Adj Ref" is selected
    const handleKeyDown = (e, index) => {
      console.log("Pressed:", e.key, "on row", index); // 👈 Add this
      const selectedType = rows[index].type;
      if (e.key === "Enter" && selectedType === "Adj Ref") {
        console.log("Opening pending modal"); // 👈 Add this too
        openPendingModal(index);
      }
    };

    const totalAdjusted = rows.reduce((sum, row) => {
      const amt = parseFloat(row.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const handleSave = async () => {
      try {
        onHide(); // modal band karo

        // 🔁 Navigate to ledger page
        navigate("/ledger");
      } catch (error) {
        console.error("Save error:", error);
        alert("Error saving ledger. Please try again.");
      }
    };

    const pending = amount - totalAdjusted;

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
            <tbody>
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
                  {/* <td>
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
                  </td> */}
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
