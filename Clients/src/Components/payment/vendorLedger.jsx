import React, { useState } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import axios from "../../Config/axios";
import VendorModel from "./VendorModel";

const vendorLedger = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  console.log(ledgerEntries, "Ledger Entries");

  // ✅ Ledger Fetch
  const fetchLedger = async () => {
    if (!selectedVendor) return alert("Please select customer");

    const res = await axios.get(`/vendor/ledger/${selectedVendor._id}`, {
      params: {
        startDate,
        endDate,
      },
    });

    setLedgerEntries(res.data.data || []);
  };

  return (
    <Container fluid className='p-4'>
      <h2>Vendor Ledger</h2>

      <Row className='mb-4'>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Vendor</Form.Label>
            <div className='d-flex'>
              <Form.Control
                value={selectedVendor ? selectedVendor.name : ""}
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
            <th>Debit</th>
            {/* <th>Credit</th> */}
            {/* <th>Net</th> */}
          </tr>
        </thead>
        <tbody>
          {ledgerEntries.length === 0 ? (
            <tr>
              <td colSpan='9' className='text-center'>
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
                <td>₹ {Number(entry.debit).toFixed(2)}</td>
                {/* <td>₹ {Number(entry.credit).toFixed(2)}</td> */}
                {/* <td>
                  ₹ {(Number(entry.debit) - Number(entry.credit)).toFixed(2)}
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* ✅ Modal Component */}
      <VendorModel
        show={showModal}
        onHide={() => setShowModal(false)}
        onSelect={(c) => setSelectedVendor(c)}
      />
    </Container>
  );
};

export default vendorLedger;
