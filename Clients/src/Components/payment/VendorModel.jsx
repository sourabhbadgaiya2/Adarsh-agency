import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

import { fetchVendors } from "../../redux/features/vendor/VendorThunks";
import { useSelector, useDispatch } from "react-redux";

const VendorModal = ({ show, onHide, onSelect }) => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const vendor = useSelector((state) => state.vendor.vendors);

  useEffect(() => {
    dispatch(fetchVendors());
  }, []);

  const filtered = vendor.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal show={show} onHide={onHide} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Select Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type='text'
          placeholder='Search customer...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='mb-3'
        />

        <Table bordered hover size='sm'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.mobile || "-"}</td>
                <td>{c.email || "-"}</td>
                <td>
                  <Button
                    variant='primary'
                    size='sm'
                    onClick={() => {
                      onSelect(c);
                      onHide();
                    }}
                  >
                    Select
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan='4' className='text-center'>
                  No customer found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VendorModal;
