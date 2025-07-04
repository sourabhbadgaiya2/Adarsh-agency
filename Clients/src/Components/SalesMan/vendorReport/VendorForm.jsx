import React, { useEffect, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const VendorForm = ({
  vendor,
  setVendor,
  handleSubmit,
  editId,
  handleKeyDown,
  inputRefs,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className='mt-3'>
        <Col md={4}>
          <Form.Group controlId='vendorFirm'>
            <Form.Label>
              Firm Name <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              ref={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
              type='text'
              name='firm'
              value={vendor.firm}
              onChange={handleChange}
              placeholder='Enter vendor firm'
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId='vendorName'>
            <Form.Label>
              Vendor Name <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              ref={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              type='text'
              name='name'
              value={vendor.name}
              onChange={handleChange}
              placeholder='Enter vendor name'
              required
            />
          </Form.Group>
        </Col>
        <Col md={4} className='mb-3'>
          <Form.Label>Designation</Form.Label>
          <Form.Control
            ref={(el) => (inputRefs.current[2] = el)}
            onKeyDown={(e) => handleKeyDown(e, 2)}
            name='designation'
            placeholder='Designation'
            value={vendor.designation}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col md={4}>
          <Form.Group controlId='vendorMobile'>
            <Form.Label>
              Mobile Number <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              ref={(el) => (inputRefs.current[3] = el)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              type='text'
              name='mobile'
              value={vendor.mobile}
              onChange={handleChange}
              placeholder='Enter mobile number'
              required
            />
          </Form.Group>
        </Col>
        <Col md={4} className='mb-3'>
          <Form.Label>Alternate Mobile</Form.Label>
          <Form.Control
            ref={(el) => (inputRefs.current[4] = el)}
            onKeyDown={(e) => handleKeyDown(e, 4)}
            name='alternateMobile'
            placeholder='Alternate Mobile'
            value={vendor.alternateMobile}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <Form.Group controlId='vendorEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              ref={(el) => (inputRefs.current[5] = el)}
              onKeyDown={(e) => handleKeyDown(e, 5)}
              type='text'
              name='email'
              value={vendor.email}
              onChange={handleChange}
              placeholder='Enter email'
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col md={4} className='mb-3'>
          <Form.Label>WhatsApp No.</Form.Label>
          <Form.Control
            ref={(el) => (inputRefs.current[6] = el)}
            onKeyDown={(e) => handleKeyDown(e, 6)}
            name='whatsapp'
            placeholder='WhatsApp'
            value={vendor.whatsapp}
            onChange={handleChange}
          />
        </Col>
        <Col md={4} className='mb-3'>
          <Form.Label>City</Form.Label>
          <Form.Control
            ref={(el) => (inputRefs.current[7] = el)}
            onKeyDown={(e) => handleKeyDown(e, 7)}
            name='city'
            placeholder='City'
            value={vendor.city}
            onChange={handleChange}
          />
        </Col>

        <Col md={4}>
          <Form.Group controlId='vendorAddress'>
            <Form.Label>
              Address <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              ref={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)}
              type='text'
              name='address'
              value={vendor.address}
              onChange={handleChange}
              placeholder='Enter address'
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className='mb-3'>
            <Form.Label>GST No.</Form.Label>
            <Form.Control
              ref={(el) => (inputRefs.current[9] = el)}
              onKeyDown={(e) => handleKeyDown(e, 9)}
              name='gstNumber'
              className='form-control'
              placeholder='GST No.'
              value={vendor.gstNumber}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant='primary' type='submit' className='mt-3'>
        {editId ? "Update Vendor" : "Add Vendor"}
      </Button>
    </Form>
  );
};

export default VendorForm;
