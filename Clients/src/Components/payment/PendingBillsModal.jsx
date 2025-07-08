import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";

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

  // 🧾 Define columns for the table
  // const columns = [
  //   {
  //     name: "Entry No",
  //     selector: (row) => row.entryNumber || row.partyNo || "N/A",
  //     sortable: true,
  //   },
  //   {
  //     name: "Total Amount",
  //     selector: (row) => row.items?.[0]?.totalAmount || 0,
  //     sortable: true,
  //     cell: (row) => `₹ ${row.items?.[0]?.totalAmount?.toLocaleString() || 0}`,
  //   },
  //   {
  //     name: "Date",
  //     selector: (row) => row.date || "N/A",
  //   },
  //   {
  //     name: "Action",
  //     cell: (row) => (
  //       <button
  //         className='btn btn-sm btn-primary'
  //         onClick={() => {
  //           onBillSelect(row);
  //           onHide();
  //         }}
  //       >
  //         Select
  //       </button>
  //     ),
  //   },
  // ];




  
  const columns = [
    {
      name: "INVOICE NO.",
      selector: (row) => row.invoiceNumber || row.entryNumber || "N/A",
      sortable: true,
    },
    {
      name: "INV_AMOUNT",
      selector: (row) => row.items?.[0]?.totalAmount || 0,
      sortable: true,
      cell: (row) => `₹ ${row.items?.[0]?.totalAmount?.toLocaleString() || 0}`,
      right: true,
    },
    {
      name: "BILL DATE",
      selector: (row) => row.billDate || "N/A", // assuming billDate is in YYYY-MM-DD
      sortable: true,
    },
    {
      name: "DUE DATE",
      selector: (row) => row.dueDate || "N/A", // assume dueDate field
      sortable: true,
    },
    {
      name: "DAYS",
      selector: (row) => {
        const today = new Date();
        const due = new Date(row.dueDate);
        const diff = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        return isNaN(diff) ? "-" : Math.abs(diff);
      },
      center: true,
    },
    {
      name: "BALANCE",
      selector: (row) => row.balance || 0,
      cell: (row) =>
        `₹ ${Math.abs(row.balance || 0).toLocaleString()} ${
          row.balance >= 0 ? "Dr" : "Cr"
        }`,
      sortable: true,
      right: true,
    },
    {
      name: "AMOUNT",
      cell: (row) => (
        // <button
        //   className='btn btn-sm btn-primary'
        //   onClick={() => {
        //     onBillSelect(row);
        //     onHide();
        //   }}
        // >
        //   Select
        // </button>
        <button
          className='btn btn-sm btn-primary'
          onClick={() => {
            console.log("Selected Bill ID:", row._id.$oid); // 👈 Bill ID yahan milegi
            onBillSelect(row._id.$oid); // Sirf ID bhejna ho to
            onHide();
          }}
        >
          Select
        </button>
      ),
      center: true,
    },
  ];

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

// const PendingBillsModal = ({ show, onHide, bills = [], onSelectItem }) => {
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   useEffect(() => {
//     if (show) {
//       setSelectedIndex(0);
//     }
//   }, [show]);

//   const handleItemSelection = (bill, itemId) => {
//     const enteredAmount = prompt("Enter amount to subtract:");
//     if (!enteredAmount || isNaN(enteredAmount)) {
//       alert("Please enter a valid number");
//       return;
//     }

//     onSelectItem({
//       bill,
//       itemId,
//       enteredAmount: Number(enteredAmount),
//     });

//     onHide();
//   };

//   const handleKey = (e) => {
//     if (!show || bills.length === 0) return;

//     if (e.key === "ArrowDown") {
//       setSelectedIndex((prev) => (prev + 1) % bills.length);
//     } else if (e.key === "ArrowUp") {
//       setSelectedIndex((prev) => (prev === 0 ? bills.length - 1 : prev - 1));
//     } else if (e.key === "Enter") {
//       const selected = bills[selectedIndex];
//       if (selected) {
//         const itemId = selected.items?.[0]?._id; // pick first item
//         handleItemSelection(selected, itemId);
//       }
//     } else if (e.key === "Escape") {
//       onHide();
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [show, selectedIndex, bills]);

//   const columns = [
//     { name: "INVOICE NO", selector: (row) => row.entryNumber || "N/A" },
//     {
//       name: "BALANCE",
//       selector: (row) => row.pendingAmount || 0,
//       cell: (row) => `₹ ${row.pendingAmount || 0}`,
//       right: true,
//     },
//     {
//       name: "ACTION",
//       cell: (row) => (
//         <div>
//           {row.items.map((item, idx) => (
//             <button
//               key={item._id}
//               className='btn btn-sm btn-primary mb-1'
//               onClick={() => handleItemSelection(row, item._id)}
//             >
//               Select Item {idx + 1}
//             </button>
//           ))}
//         </div>
//       ),
//     },
//   ];

//   {
//     bills.map((bill, idx) => (
//       <div
//         key={bill._id}
//         style={{
//           backgroundColor: "#f9f9f9",
//           padding: "12px",
//           marginBottom: "10px",
//           border: "1px solid #ccc",
//           borderRadius: "6px",
//         }}
//       >
//         <h5>
//           🔖 Bill #{bill.entryNumber || "N/A"} | Pending: ₹{bill.pendingAmount}
//         </h5>

//         <table className='table table-bordered table-sm mt-2'>
//           <thead>
//             <tr>
//               <th>Item No</th>
//               <th>Product ID</th>
//               <th>Rate</th>
//               <th>Qty</th>
//               <th>Total</th>
//               <th>Select</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bill.items.map((item, itemIdx) => (
//               <tr key={item._id}>
//                 <td>{itemIdx + 1}</td>
//                 <td>{item.productId?.$oid || item.productId}</td>
//                 <td>{item.purchaseRate}</td>
//                 <td>{item.quantity}</td>
//                 <td>₹ {item.totalAmount}</td>
//                 <td>
//                   <button
//                     className='btn btn-sm btn-primary'
//                     onClick={() => handleItemSelection(bill, item._id)}
//                   >
//                     Select
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     ));
//   }

//   return (
//     <Modal show={show} onHide={onHide} fullscreen>
//       <Modal.Header closeButton>
//         <Modal.Title>Pending Bills</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <DataTable
//           columns={columns}
//           data={bills}
//           highlightOnHover
//           pointerOnHover
//         />
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default PendingBillsModal;
