// import React, {
//   useState,
//   useImperativeHandle,
//   forwardRef,
//   useEffect,
//   useRef,
// } from "react";
// import { Modal, Form, Table } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../Config/axios";

// const BillAdjustmentModal = forwardRef(
//   (
//     {
//       show,
//       onHide,
//       amount,
//       openPendingModal,
//       selectedVendorId,
//       onPendingChange,
//     },
//     ref
//   ) => {
//     const [rows, setRows] = useState([
//       {
//         type: "Adj Ref",
//         particulars: "",
//         dueDays: "",
//         amount: "",
//         remark: "",
//         balance: "",
//       },
//     ]);

//     const [focusedRowIndex, setFocusedRowIndex] = useState(null);
//     const [cashDiscount, setCashDiscount] = useState(0);

//     const selectRef = useRef(); // Ref for first dropdown

//     const typeMap = {
//       "Adj Ref": "adjustment",
//       "New Ref": "new_ref",
//       Clear: "clear_ref",
//     };

//     const navigate = useNavigate();

//     // 🔁 Reset rows when modal is closed
//     useEffect(() => {
//       if (!show) {
//         setRows([
//           {
//             type: "Adj Ref",
//             particulars: "",
//             dueDays: "",
//             amount: "",
//             remark: "",
//             balance: "",
//           },
//         ]);
//       }
//     }, [show]);

//     // 🔁 On modal open, auto-focus and open dropdown
//     useEffect(() => {
//       if (show && selectRef.current) {
//         setTimeout(() => {
//           selectRef.current.focus();

//           // Simulate ArrowDown key to open dropdown visually
//           const event = new KeyboardEvent("keydown", {
//             key: "ArrowDown",
//             bubbles: true,
//           });
//           selectRef.current.dispatchEvent(event);
//         }, 100);
//       }
//     }, [show]);

//     // 🔁 Expose method to parent to insert bill
//     useImperativeHandle(ref, () => ({
//       insertBill: (rowIndex, { bill, itemId, enteredAmount }) => {
//         const updated = [...rows];
//         updated[rowIndex] = {
//           ...updated[rowIndex],
//           particulars: `Bill #${bill.entryNumber}`,
//           amount: enteredAmount,
//           balance: bill.pendingAmount,
//           purchaseEntryId: bill._id,
//           itemId: itemId,
//         };
//         setRows(updated);
//       },
//     }));

//     const handleChange = (index, field, value) => {
//       const updated = [...rows];

//       updated[index][field] = value;

//       if (field === "type") {
//         if (value === "New Ref") {
//           // ✅ New Ref: amount = pending
//           const pendingAmount = amount - totalAdjusted;
//           if (pendingAmount > 0) {
//             updated[index].amount = pendingAmount.toFixed(2);
//           } else {
//             updated[index].amount = "0";
//           }

//           updated[index].particulars = "New Ref Adjustment";
//           updated[index].balance = "0";
//         } else if (value === "Clear") {
//           // ✅ Clear: reset everything for this row
//           updated[index].amount = "0";
//           updated[index].particulars = "";
//           updated[index].dueDays = "";
//           updated[index].remark = "";
//           updated[index].balance = "";
//         } else if (value === "Adj Ref") {
//           // ✅ Switching back to Adj Ref: clear amount and details
//           updated[index].amount = "";
//           updated[index].particulars = "";
//           updated[index].balance = "";
//         }
//       }

//       setRows(updated);
//     };

//     const handleKeyDown = async (e, index) => {
//       const selectedType = rows[index].type;

//       if (e.key === "Enter") {
//         e.preventDefault();

//         if (selectedType === "Adj Ref") {
//           openPendingModal(index); // ✅ Open pending bills modal
//         }
//         if (selectedType === "New Ref") {
//           const pendingAmount = amount - totalAdjusted;
//           console.log(pendingAmount, "Before");

//           if (pendingAmount <= 0) {
//             alert("Nothing to adjust.");
//             return;
//           }

//           console.log(pendingAmount, "after");
//           console.log(selectedVendorId, "Payload");

//           const payload = {
//             amount: Number(pendingAmount.toFixed(2)),
//             customerId: selectedVendorId,
//             refType: typeMap[selectedType],
//           };

//           try {
//             const res = await axiosInstance.post(
//               "/pro-billing/adjust-vendor-direct",
//               payload
//             );

//             alert("✅ Amount adjusted successfully");

//             const updated = [...rows];
//             updated[index].particulars = "New Ref Adjustment";
//             updated[index].amount = pendingAmount.toFixed(2);
//             updated[index].balance = 0;
//             setRows(updated);
//           } catch (err) {
//             console.error(err);
//             alert("❌ Failed to adjust amount");
//           }
//         }
//       }
//     };

//     const totalAdjusted = rows.reduce((sum, row) => {
//       const amt = parseFloat(row.amount);
//       return sum + (isNaN(amt) ? 0 : amt);
//     }, 0);

//     const handleSave = async () => {
//       console.log("📦 Saving payload:", selectedVendorId, pending);

//       const payload = {
//         customerId: selectedVendorId,
//         amount: amount,
//         refType: typeMap[rows[0].type], // ✅ pehli row ka type map karo
//       };

//       try {
//         const res = await axiosInstance.post("/pro-billing/new", payload);

//         if (res.status !== 200) throw new Error("Server error");
//         console.log("Response:", res.data);
//         alert("✅ Payment adjusted successfully");
//         onHide();
//         navigate("/");
//       } catch (error) {
//         console.error("❌ Error saving adjustment:", error.message);
//         alert("Failed to save adjustment");
//       }
//     };

//     const pending = amount - totalAdjusted;

//     useEffect(() => {
//       const pending = amount - totalAdjusted;
//       if (onPendingChange) {
//         onPendingChange(Number(pending.toFixed(2)));
//       }
//     }, [rows, amount, totalAdjusted, onPendingChange]);

//     return (
//       <Modal show={show} onHide={onHide} fullscreen>
//         <Modal.Header closeButton>
//           <Modal.Title>Bill Adjustment</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>
//             <strong>Amount:</strong> ₹{amount.toFixed(2)} Dr
//           </p>

//           <Table bordered size='sm'>
//             <thead>
//               <tr>
//                 <th>Type</th>
//                 <th>Particulars</th>
//                 <th>Due Days</th>
//                 <th>Amount</th>
//                 <th>Remark</th>
//                 <th>Balance</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((row, idx) => (
//                 <tr key={idx}>
//                   {/* TYPE */}
//                   <td>
//                     <Form.Control
//                       as='select'
//                       ref={idx === 0 ? selectRef : null}
//                       value={row.type || ""}
//                       onFocus={() => setFocusedRowIndex(idx)}
//                       onChange={(e) =>
//                         handleChange(idx, "type", e.target.value)
//                       }
//                       onKeyDown={(e) => handleKeyDown(e, idx)}
//                     >
//                       <option value='Adj Ref'>Adj Ref</option>
//                       <option value='New Ref'>New Ref</option>
//                       <option value='Clear'>Clear</option>
//                     </Form.Control>
//                   </td>

//                   {/* PARTICULARS */}
//                   <td>
//                     <Form.Control
//                       value={row.particulars || ""}
//                       onChange={(e) =>
//                         handleChange(idx, "particulars", e.target.value)
//                       }
//                       disabled={row.type === "New Ref"}
//                     />
//                   </td>

//                   {/* DUE DAYS */}
//                   <td>
//                     <Form.Control
//                       type='number'
//                       value={row.dueDays || ""}
//                       onChange={(e) =>
//                         handleChange(idx, "dueDays", e.target.value)
//                       }
//                       disabled={row.type === "New Ref"}
//                     />
//                   </td>

//                   {/* AMOUNT INPUT — ENABLE only for "New Ref" */}
//                   <td>
//                     <Form.Control
//                       type='number'
//                       value={row.amount || ""}
//                       onChange={(e) =>
//                         handleChange(idx, "amount", e.target.value)
//                       }
//                       onKeyDown={(e) => handleKeyDown(e, idx)}
//                       placeholder={
//                         row.type === "New Ref" ? "Enter amount to adjust" : ""
//                       }
//                       disabled={row.type !== "New Ref"}
//                     />
//                   </td>

//                   {/* REMARK */}
//                   <td>
//                     <Form.Control
//                       value={row.remark || ""}
//                       onChange={(e) =>
//                         handleChange(idx, "remark", e.target.value)
//                       }
//                       disabled={row.type === "New Ref"}
//                     />
//                   </td>

//                   {/* BALANCE */}
//                   <td>
//                     <Form.Control
//                       value={row.balance || ""}
//                       onChange={(e) =>
//                         handleChange(idx, "balance", e.target.value)
//                       }
//                       disabled={row.type === "New Ref"}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           <div className='d-flex justify-content-between mt-3'>
//             <span>
//               <strong>Adjusted:</strong> ₹{totalAdjusted.toFixed(2)} Dr
//             </span>
//             <span>
//               <strong>Pending:</strong> ₹{pending.toFixed(2)} Dr
//             </span>
//           </div>

//           <Modal.Footer>
//             <button
//               className='btn btn-primary'
//               onClick={handleSave}
//               disabled={rows.length === 0}
//             >
//               Save
//             </button>
//           </Modal.Footer>
//         </Modal.Body>
//       </Modal>
//     );
//   }
// );

// export default BillAdjustmentModal;

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

import Header from "./Header";


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

    const [focusedRowIndex, setFocusedRowIndex] = useState(null);
    const [cashDiscount, setCashDiscount] = useState(0);

    const selectRef = useRef(); // Ref for first dropdown

    const typeMap = {
      "Adj Ref": "adjustment",
      "New Ref": "new_ref",
      Clear: "clear_ref",
    };

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

      if (field === "type") {
        if (value === "New Ref") {
          // ✅ New Ref: amount = pending
          const pendingAmount = amount - totalAdjusted;
          if (pendingAmount > 0) {
            updated[index].amount = pendingAmount.toFixed(2);
          } else {
            updated[index].amount = "0";
          }

          updated[index].particulars = "New Ref Adjustment";
          updated[index].balance = "0";
        } else if (value === "Clear") {
          // ✅ Clear: reset everything for this row
          updated[index].amount = "0";
          updated[index].particulars = "";
          updated[index].dueDays = "";
          updated[index].remark = "";
          updated[index].balance = "";
        } else if (value === "Adj Ref") {
          // ✅ Switching back to Adj Ref: clear amount and details
          updated[index].amount = "";
          updated[index].particulars = "";
          updated[index].balance = "";
        }
      }

      setRows(updated);
    };

    const handleKeyDown = async (e, index) => {
      const selectedType = rows[index].type;

      if (e.key === "Enter") {
        e.preventDefault();

        if (selectedType === "Adj Ref") {
          openPendingModal(index); // ✅ Open pending bills modal
        }
        if (selectedType === "New Ref") {
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
            customerId: selectedVendorId,
            refType: typeMap[selectedType],
          };

          try {
            const res = await axiosInstance.post(
              "/pro-billing/adjust-vendor-direct",
              payload
            );

            alert("✅ Amount adjusted successfully");

            const updated = [...rows];
            updated[index].particulars = "New Ref Adjustment";
            updated[index].amount = pendingAmount.toFixed(2);
            updated[index].balance = 0;
            setRows(updated);
          } catch (err) {
            console.error(err);
            alert("❌ Failed to adjust amount");
          }
        }
      }
    };

    const totalAdjusted = rows.reduce((sum, row) => {
      const amt = parseFloat(row.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const handleSave = async () => {
      console.log("📦 Saving payload:", selectedVendorId, pending);

      const payload = {
        customerId: selectedVendorId,
        amount: amount,
        refType: typeMap[rows[0].type], // ✅ pehli row ka type map karo
      };

      try {
        const res = await axiosInstance.post("/pro-billing/new", payload);

        if (res.status !== 200) throw new Error("Server error");
        console.log("Response:", res.data);
        alert("✅ Payment adjusted successfully");
        onHide();
        navigate("/");
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

      <>
        <Modal show={show} onHide={onHide} fullscreen>
          <Header />

          <Modal.Header
            style={{ backgroundColor: "#3C6360" }}
            className='bg-bg-success'
            closeButton
          >
            <Modal.Title className='text-white'>Bill Adjustment</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className='px-4 py-3'
            style={{ fontFamily: "Courier New, monospace" }}
          >
            <div className='mb-3'>
              <div className='d-flex justify-content-between'>
                <div>
                  <strong>JYOTI LABS LIMITED-INDORE</strong>
                  <br />
                  INDORE SALES DEPO 37-38 LASUDIYA MORI DEWAS NA
                </div>
                <div className='text-end'>
                  <strong>Amount :</strong> ₹{amount.toFixed(2)} Dr
                </div>
              </div>
            </div>

            <div
              className='border border-dark'
              style={{ borderWidth: "2px" }}
            ></div>

            <div
              className='d-flex text-uppercase fw-bold mt-2 mb-2 px-1'
              style={{ fontSize: "13px" }}
            >
              <div style={{ width: "15%" }}>Type</div>
              <div style={{ width: "30%" }}>Particulars</div>
              <div style={{ width: "15%" }}>Due Days</div>
              <div style={{ width: "15%" }}>Amount</div>
              <div style={{ width: "15%" }}>Remark</div>
              <div style={{ width: "15%" }}>Balance</div>
            </div>

            <div
              className='border border-dark'
              style={{ borderWidth: "1px" }}
            ></div>

            {/* Render Table-Like Editable Rows */}
            {rows.map((row, idx) => (
              <div className='d-flex align-items-center mb-2 px-1' key={idx}>
                {/* Type */}
                <div style={{ width: "15%" }}>
                  <Form.Select
                    size='sm'
                    value={row.type}
                    onChange={(e) => handleChange(idx, "type", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={idx === 0 ? selectRef : null}
                  >
                    <option value='Adj Ref'>Adj Ref</option>
                    <option value='New Ref'>New Ref</option>
                    <option value='Clear'>Clear</option>
                  </Form.Select>
                </div>

                {/* Particulars */}
                <div style={{ width: "30%", padding: "0 4px" }}>
                  <Form.Control
                    size='sm'
                    value={row.particulars}
                    onChange={(e) =>
                      handleChange(idx, "particulars", e.target.value)
                    }
                    disabled={row.type === "New Ref"}
                  />
                </div>

                {/* Due Days */}
                <div style={{ width: "15%", padding: "0 4px" }}>
                  <Form.Control
                    size='sm'
                    type='number'
                    value={row.dueDays}
                    onChange={(e) =>
                      handleChange(idx, "dueDays", e.target.value)
                    }
                    disabled={row.type === "New Ref"}
                  />
                </div>

                {/* Amount */}
                <div style={{ width: "15%", padding: "0 4px" }}>
                  <Form.Control
                    size='sm'
                    type='number'
                    value={row.amount}
                    onChange={(e) =>
                      handleChange(idx, "amount", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    disabled={row.type !== "New Ref"}
                  />
                </div>

                {/* Remark */}
                <div style={{ width: "15%", padding: "0 4px" }}>
                  <Form.Control
                    size='sm'
                    value={row.remark}
                    onChange={(e) =>
                      handleChange(idx, "remark", e.target.value)
                    }
                    disabled={row.type === "New Ref"}
                  />
                </div>

                {/* Balance */}
                <div style={{ width: "15%" }}>
                  <Form.Control
                    size='sm'
                    value={row.balance}
                    onChange={(e) =>
                      handleChange(idx, "balance", e.target.value)
                    }
                    disabled={row.type === "New Ref"}
                  />
                </div>
              </div>
            ))}

            <div
              className='border border-dark mt-2'
              style={{ borderWidth: "2px" }}
            ></div>

            <div
              className='d-flex justify-content-end gap-5 mt-2'
              style={{ fontSize: "14px" }}
            >
              <span>
                <strong>ADJUSTED:</strong> ₹{totalAdjusted.toFixed(2)} Dr
              </span>
              <span>
                <strong>PENDING:</strong> ₹{pending.toFixed(2)} Dr
              </span>
            </div>
          </Modal.Body>
        </Modal>
      </>
=======
<>

  <Modal show={show} onHide={onHide} fullscreen>
   <Header/>

        <Modal.Header style={{ backgroundColor:"#3C6360" }} className="bg-bg-success" closeButton>
          <Modal.Title className="text-white">Bill Adjustment</Modal.Title>
        </Modal.Header>
      <Modal.Body className="px-4 py-3" style={{ fontFamily: "Courier New, monospace" }}>
  <div className="mb-3">
    <div className="d-flex justify-content-between">
      <div>
        <strong>JYOTI LABS LIMITED-INDORE</strong><br />
        INDORE SALES DEPO 37-38 LASUDIYA MORI DEWAS NA
      </div>
      <div className="text-end">
        <strong>Amount :</strong> ₹{amount.toFixed(2)} Dr
      </div>
    </div>
  </div>

  <div className="border border-dark" style={{ borderWidth: "2px" }}></div>

  <div className="d-flex text-uppercase fw-bold mt-2 mb-2 px-1" style={{ fontSize: "13px" }}>
    <div style={{ width: "15%" }}>Type</div>
    <div style={{ width: "30%" }}>Particulars</div>
    <div style={{ width: "15%" }}>Due Days</div>
    <div style={{ width: "15%" }}>Amount</div>
    <div style={{ width: "15%" }}>Remark</div>
    <div style={{ width: "15%" }}>Balance</div>
  </div>

  <div className="border border-dark" style={{ borderWidth: "1px" }}></div>

  {/* Render Table-Like Editable Rows */}
  {rows.map((row, idx) => (
    <div className="d-flex align-items-center mb-2 px-1" key={idx}>
      {/* Type */}
      <div style={{ width: "15%" }}>
        <Form.Select
          size="sm"
          value={row.type}
          onChange={(e) => handleChange(idx, "type", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          ref={idx === 0 ? selectRef : null}
        >
          <option value="Adj Ref">Adj Ref</option>
          <option value="New Ref">New Ref</option>
          <option value="Clear">Clear</option>
        </Form.Select>
      </div>

      {/* Particulars */}
      <div style={{ width: "30%", padding: "0 4px" }}>
        <Form.Control
          size="sm"
          value={row.particulars}
          onChange={(e) => handleChange(idx, "particulars", e.target.value)}
          disabled={row.type === "New Ref"}
        />
      </div>

      {/* Due Days */}
      <div style={{ width: "15%", padding: "0 4px" }}>
        <Form.Control
          size="sm"
          type="number"
          value={row.dueDays}
          onChange={(e) => handleChange(idx, "dueDays", e.target.value)}
          disabled={row.type === "New Ref"}
        />
      </div>

      {/* Amount */}
      <div style={{ width: "15%", padding: "0 4px" }}>
        <Form.Control
          size="sm"
          type="number"
          value={row.amount}
          onChange={(e) => handleChange(idx, "amount", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          disabled={row.type !== "New Ref"}
        />
      </div>

      {/* Remark */}
      <div style={{ width: "15%", padding: "0 4px" }}>
        <Form.Control
          size="sm"
          value={row.remark}
          onChange={(e) => handleChange(idx, "remark", e.target.value)}
          disabled={row.type === "New Ref"}
        />
      </div>

      {/* Balance */}
      <div style={{ width: "15%" }}>
        <Form.Control
          size="sm"
          value={row.balance}
          onChange={(e) => handleChange(idx, "balance", e.target.value)}
          disabled={row.type === "New Ref"}
        />
      </div>
    </div>
  ))}

  <div className="border border-dark mt-2" style={{ borderWidth: "2px" }}></div>

  <div className="d-flex justify-content-end gap-5 mt-2" style={{ fontSize: "14px" }}>
    <span><strong>ADJUSTED:</strong> ₹{totalAdjusted.toFixed(2)} Dr</span>
    <span><strong>PENDING:</strong> ₹{pending.toFixed(2)} Dr</span>
  </div>
</Modal.Body>

      </Modal>
</>


    );
  }
);

export default BillAdjustmentModal;
