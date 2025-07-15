// import React, { useState } from "react";
// import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
// import axios from "../../Config/axios";
// import CustomerModal from "./CustomerModal"; // ✅ Modal

// const Ledger = () => {
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [ledgerEntries, setLedgerEntries] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   // ✅ Ledger Fetch
//   const fetchLedger = async () => {
//     if (!selectedCustomer) return alert("Please select customer");

//     const res = await axios.get("/ledger", {
//       params: {
//         customerId: selectedCustomer._id,
//         startDate,
//         endDate,
//       },
//     });
//     setLedgerEntries(res.data);
//   };

//   return (
//     <Container fluid className='p-4'>
//       <h2>Customer Ledger</h2>

//       <Row className='mb-4'>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Customer</Form.Label>
//             <div className='d-flex'>
//               <Form.Control
//                 value={selectedCustomer ? selectedCustomer.name : ""}
//                 placeholder='Select customer'
//                 readOnly
//               />
//               <Button
//                 variant='secondary'
//                 onClick={() => setShowModal(true)}
//                 className='ms-2'
//               >
//                 Search
//               </Button>
//             </div>
//           </Form.Group>
//         </Col>

//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Start Date</Form.Label>
//             <Form.Control
//               type='date'
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>

//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>End Date</Form.Label>
//             <Form.Control
//               type='date'
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </Form.Group>
//         </Col>

//         <Col md={3} className='d-flex align-items-end'>
//           <Button variant='primary' onClick={fetchLedger}>
//             Get Ledger
//           </Button>
//         </Col>
//       </Row>

//       <Table striped bordered hover size='sm'>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Ref Type</th>
//             <th>Ref ID</th>
//             <th>Narration</th>
//             <th>Debit Account</th>
//             <th>Credit Account</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ledgerEntries.length === 0 ? (
//             <tr>
//               <td colSpan='7' className='text-center'>
//                 No records found
//               </td>
//             </tr>
//           ) : (
//             ledgerEntries.map((entry) => (
//               <tr key={entry._id}>
//                 <td>{new Date(entry.date).toLocaleDateString()}</td>
//                 <td>{entry.refType}</td>
//                 <td>{entry.refId}</td>
//                 <td>{entry.narration}</td>
//                 <td>{entry.debitAccount}</td>
//                 <td>{entry.creditAccount}</td>
//                 <td>₹ {entry.amount.toFixed(2)}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </Table>

//       {/* ✅ Modal Component */}
//       <CustomerModal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         onSelect={(c) => setSelectedCustomer(c)}
//       />
//     </Container>
//   );
// };

// export default Ledger;

import React, { useState } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import axios from "../../Config/axios";
import CustomerModal from "./CustomerModal"; // ✅ Modal

const Ledger = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // ✅ Ledger Fetch
  const fetchLedger = async () => {
    if (!selectedCustomer) return alert("Please select customer");

    const res = await axios.get("/ledger", {
      params: {
        customerId: selectedCustomer._id,
        startDate,
        endDate,
      },
    });
    setLedgerEntries(res.data);
  };

  return (
    <Container fluid className='p-4'>
      <h2>Customer Ledger</h2>

      <Row className='mb-4'>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Customer</Form.Label>
            <div className='d-flex'>
              <Form.Control
                value={selectedCustomer ? selectedCustomer.name : ""}
                placeholder='Select customer'
                readOnly
              />
              <Button
                variant='secondary'
                onClick={() => setShowModal(true)}
                className='ms-2'
              >
                Search
              </Button>
            </div>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={3} className='d-flex align-items-end'>
          <Button variant='primary' onClick={fetchLedger}>
            Get Ledger
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Ref Type</th>
            <th>Ref ID</th>
            <th>Narration</th>
            <th>Debit Account</th>
            <th>Credit Account</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {ledgerEntries.length === 0 ? (
            <tr>
              <td colSpan='7' className='text-center'>
                No records found
              </td>
            </tr>
          ) : (
            ledgerEntries.map((entry) => (
              <tr key={entry._id}>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.refType}</td>
                <td>{entry.refId}</td>
                <td>{entry.narration}</td>
                <td>{entry.debitAccount}</td>
                <td>{entry.creditAccount}</td>
                <td>₹ {entry.amount.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* ✅ Modal Component */}
      <CustomerModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSelect={(c) => setSelectedCustomer(c)}
      />
    </Container>
  );
};

export default Ledger;
