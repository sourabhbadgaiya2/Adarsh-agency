import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Table,
  Card,
} from "react-bootstrap";
import axios from "../../Config/axios";

const VendorReport = () => {
  const [vendor, setVendor] = useState({
    firm: "",
    name: "",
    designation: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    whatsapp: "",
    city: "",
    address: "",
    gstNumber: "",
  });

  const [vendorList, setVendorList] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  const fetchVendors = async () => {
    const res = await axios.get("/vendor");
    console.log(res.data, "Vendors fetched");
    setVendorList(res.data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendor.name || !vendor.mobile || !vendor.address) {
      alert("Please fill all required fields");
      return;
    }

    if (editId) {
      await axios.put(`/vendor/${editId}`, vendor);
      setEditId(null);
    } else {
      await axios.post("/vendor", vendor);
    }

    setVendor({
      firm: "",
      name: "",
      designation: "",
      mobile: "",
      alternateMobile: "",
      email: "",
      whatsapp: "",
      city: "",
      address: "",
      gstNumber: "",
    });
    fetchVendors();
  };

  const handleEdit = (v) => {
    setVendor(v);
    setEditId(v._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/vendor/${id}`);
    fetchVendors();
  };

  return (
    <Container className="my-4">
      <Card className="p-4">
        <h4 className="mb-3">{editId ? "Edit Vendor" : "Add Vendor"}</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group controlId="vendorFirm">
                <Form.Label>Firm Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firm"
                  value={vendor.firm}
                  onChange={handleChange}
                  placeholder="Enter vendor firm"
                />
              </Form.Group>
            </Col>
            {/* <Col md={4}>
              <Form.Group controlId="firmName" className="mb-3">
                <Form.Label>Select Firm</Form.Label>
                <Form.Select
                  name="firm"
                  value={vendor.firm}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Firm</option>
                  {firm.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col> */}
            <Col md={4}>
              <Form.Group controlId="vendorName">
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={vendor.name}
                  onChange={handleChange}
                  placeholder="Enter vendor name"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                name="designation"
                placeholder="Designation"
                value={vendor.designation}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group controlId="vendorMobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  value={vendor.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>Alternate Mobile</Form.Label>
              <Form.Control
                name="alternateMobile"
                placeholder="Alternate Mobile"
                value={vendor.alternateMobile}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Group controlId="vendorEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={vendor.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4} className="mb-3">
              <Form.Label>WhatsApp No.</Form.Label>
              <Form.Control
                name="whatsapp"
                placeholder="WhatsApp"
                value={vendor.whatsapp}
                onChange={handleChange}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                placeholder="City"
                value={vendor.city}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Group controlId="vendorAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={vendor.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>GST No.</Form.Label>
                <Form.Control
                  name="gstNumber"
                  className="form-control"
                  placeholder="GST No."
                  value={vendor.gstNumber}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3">
            {editId ? "Update Vendor" : "Add Vendor"}
          </Button>
        </Form>
      </Card>

      <Card className="mt-4 p-3">
        <h5>Vendor List</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Firm Name</th>
              <th>Vendor Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendorList.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No vendors found.
                </td>
              </tr>
            ) : (
              vendorList.map((v, index) => (
                <tr key={v._id}>
                  <td>{index + 1}</td>
                  <td>{v.firm}</td>
                  <td>{v.name}</td>
                  <td>{v.mobile}</td>
                  <td>{v.email}</td>
                  <td>{v.address}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(v)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(v._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default VendorReport;
