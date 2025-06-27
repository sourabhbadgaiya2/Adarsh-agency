import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "../../Config/axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

function AddCustomer({ refresh, editingCustomer, setEditingCustomer }) {
  const [customer, setCustomer] = useState({
    ledger: "",
    name: "",
    mobile: "",
    city: "",
    address1: "",
    creditLimit: "",
    gstNumber: "",
    creditDay: "",
    area: "",
    balance: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setCustomer({
        ledger: editingCustomer.ledger || "",
        name: editingCustomer.name || "",
        city: editingCustomer.city || "",
        mobile: editingCustomer.mobile || "",
        address1: editingCustomer.address1 || "",
        gstNumber: editingCustomer.gstNumber || "",
        balance: editingCustomer.balance || "",

        creditLimit: editingCustomer.creditLimit || "",
        creditDay: editingCustomer.creditDay
          ? editingCustomer.creditDay.slice(0, 10)
          : "",
        area: editingCustomer.area || "",
      });
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCustomer) {
        await axios.put(`/customer/${editingCustomer._id}`, customer);
        toast.success("Customer updated successfully!");
      } else {
        await axios.post("/customer", customer);
        toast.success("Customer saved successfully!");
      }

      // Reset form
      setCustomer({
        ledger: "",
        name: "",
        mobile: "",
        city: "",
        address1: "",
        gstNumber: "",
        creditLimit: "",
        creditDay: "",
        area: "",
      });

      setEditingCustomer(null);
      if (refresh) refresh();
    } catch (error) {
      toast.error("Failed to save customer.");
      console.error("Error saving customer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className='mt-4'>
      <Card>
        <Card.Header>{editingCustomer ? "Edit" : "Add"} Customer</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className='mb-3'>
                <Form.Label>
                  Firm <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  name='ledger'
                  type='text'
                  placeholder='Enter Firm Name'
                  value={customer.ledger}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>
                  Mobile Number <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type='number'
                  name='mobile'
                  placeholder='Mobile'
                  value={customer.mobile}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  name='city'
                  placeholder='City'
                  value={customer.city}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>
                  Area <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Area Name'
                  name='area'
                  value={customer.area}
                  onChange={handleChange}
                />
              </Col>

              <Col md={12} className='mb-3'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name='address1'
                  placeholder='Address'
                  value={customer.address1}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>Credit Limit</Form.Label>
                <Form.Control
                  type='number'
                  name='creditLimit'
                  placeholder='Credit Limit'
                  value={customer.creditLimit}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className='mb-3'>
                <Form.Label>Balance</Form.Label>
                <Form.Control
                  type='number'
                  name='balance'
                  placeholder='Balance'
                  value={customer.balance}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>Credit Day</Form.Label>
                <Form.Control
                  type='date'
                  name='creditDay'
                  value={customer.creditDay}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>GST No.</Form.Label>
                <Form.Control
                  name='gstNumber'
                  placeholder='GST No.'
                  value={customer.gstNumber}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Button type='submit' variant='primary'>
              {editingCustomer ? "Update Customer" : "Add Customer"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddCustomer;
