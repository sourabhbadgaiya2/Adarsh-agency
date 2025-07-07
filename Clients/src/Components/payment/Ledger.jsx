import { Container, Table, Row, Col, Card } from "react-bootstrap";

const Ledger = () => {
  const dummyData = {
    name: "John Doe",
    accountNumber: "AC123456",
    totalAmount: 1000,
    adjustedAmount: 800,
    pendingAmount: 200,
    entries: [
      {
        id: 1,
        type: "Adj Ref",
        particulars: "Invoice #001",
        debit: 500,
        credit: 0,
        remark: "Partial payment",
        balance: 0,
      },
      {
        id: 2,
        type: "Adj Ref",
        particulars: "Invoice #002",
        debit: 300,
        credit: 0,
        remark: "Settled",
        balance: 0,
      },
      {
        id: 3,
        type: "New Ref",
        particulars: "Payment Received",
        debit: 0,
        credit: 1000,
        remark: "Advance",
        balance: 1000,
      },
    ],
  };

  return (
    <Container className='mt-4'>
      <Card>
        <Card.Body>
          <Card.Title>Ledger Summary</Card.Title>

          <Row className='mb-3'>
            <Col>
              <strong>Name:</strong> {dummyData.name}
            </Col>
            <Col>
              <strong>Account No:</strong> {dummyData.accountNumber}
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col>
              <strong>Total Amount:</strong> ₹{dummyData.totalAmount.toFixed(2)}
            </Col>
            <Col>
              <strong>Adjusted:</strong> ₹{dummyData.adjustedAmount.toFixed(2)}
            </Col>
            <Col>
              <strong>Pending:</strong> ₹{dummyData.pendingAmount.toFixed(2)}
            </Col>
          </Row>

          <h5 className='mt-4 mb-2'>Adjustment Entries</h5>

          <Table striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Particulars</th>
                <th>Debit (Dr)</th>
                <th>Credit (Cr)</th>
                <th>Remark</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.type}</td>
                  <td>{entry.particulars}</td>
                  <td>₹{entry.debit.toFixed(2)}</td>
                  <td>₹{entry.credit.toFixed(2)}</td>
                  <td>{entry.remark}</td>
                  <td>₹{entry.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Ledger;
