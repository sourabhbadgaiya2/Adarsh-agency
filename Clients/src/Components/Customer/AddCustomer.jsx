import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "../../Config/axios";
import { ToastContainer, toast } from "react-toastify";

function AddCustomer({ refresh, editingCustomer, setEditingCustomer }) {
  const [customer, setCustomer] = useState({
    firm: "",
    name: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    whatsapp: "",
    designation: "",
    city: "",
    address: "",
    creditLimit: "",
    gstNumber: "",
    creditDay: "",
  });

  useEffect(() => {
    if (editingCustomer) {
      setCustomer({
        firm: editingCustomer.firm || "",
        name: editingCustomer.name || "",
        designation: editingCustomer.designation || "",
        city: editingCustomer.city || "",
        mobile: editingCustomer.mobile || "",
        alternateMobile: editingCustomer.alternateMobile || "",
        email: editingCustomer.email || "",
        whatsapp: editingCustomer.whatsapp || "",
        address: editingCustomer.address || "",
        gstNumber: editingCustomer.gstNumber || "",
        creditLimit: editingCustomer.creditLimit || "",
        creditDay: editingCustomer.creditDay?.slice(0, 10) || "",
      });
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await axios.put(`/customer/${editingCustomer._id}`, customer);
        toast.success("Customer updated successfully!");
      } else {
        await axios.post("/customer", customer);
        toast.success("Customer saved successfully!");
      }

      setCustomer({
        firm: "",
        name: "",
        designation: "",
        city: "",
        mobile: "",
        alternateMobile: "",
        email: "",
        whatsapp: "",
        address: "",
        gstNumber: "",
        creditLimit: "",
        creditDay: "",
      });
      setEditingCustomer(null);
      if (refresh) refresh();
    } catch (error) {
      toast.error("Failed to save customer.");
      console.error("Error saving customer:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>{editingCustomer ? "Edit" : "Add"} Customer</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Firm</Form.Label>
                <Form.Control
                  name="firm"
                  type="text"
                  placeholder="Enter Firm Name"
                  value={customer.firm}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Contract Person</Form.Label>
                <Form.Control
                  name="name"
                  placeholder="Contact Person"
                  value={customer.name}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  name="designation"
                  placeholder="Designation"
                  value={customer.designation}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  name="mobile"
                  placeholder="Mobile"
                  value={customer.mobile}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Alternate Mobile</Form.Label>
                <Form.Control
                  name="alternateMobile"
                  placeholder="Alternate Mobile"
                  value={customer.alternateMobile}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  placeholder="Email"
                  value={customer.email}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>WhatsApp No.</Form.Label>
                <Form.Control
                  name="whatsapp"
                  placeholder="WhatsApp"
                  value={customer.whatsapp}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  placeholder="City"
                  value={customer.city}
                  onChange={handleChange}
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  placeholder="Address"
                  value={customer.address}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Credit Limit</Form.Label>
                <Form.Control
                  type="number"
                  name="creditLimit"
                  placeholder="Credit Limit"
                  value={customer.creditLimit}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Credit Day</Form.Label>
                <Form.Control
                  type="date"
                  name="creditDay"
                  value={customer.creditDay}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>GST No.</Form.Label>
                <Form.Control
                  name="gstNumber"
                  placeholder="GST No."
                  value={customer.gstNumber}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Button type="submit" variant="primary">
              {editingCustomer ? "Update Customer" : "Add Customer"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </Container>
  );
}

export default AddCustomer;
