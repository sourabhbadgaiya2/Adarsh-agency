import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "../../Config/axios";
import { useNavigate, useParams } from "react-router-dom";
const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");

function AddSalesMan() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    mobile: "",
    email: "",
    city: "",
    address: "",
    alternateMobile: "",
    username: "",
    password: "",
  });

  // update
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [existingPhoto, setExistingPhoto] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      axios.get(`/salesman/${id}`).then((res) => {
        const s = res.data;
        setFormData({
          name: s.name || "",
          designation: s.designation || "",
          mobile: s.mobile || "",
          email: s.email || "",
          city: s.city || "",
          address: s.address || "",
          alternateMobile: s.alternateMobile || "",
          username: s.username || "",
          password: s.password || "", // pre-fill password (only if you store plaintext, which is not secure)
        });
        setExistingPhoto(s.photo); // Set image
      });
    }
  }, [id]);

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (photo) data.append("photo", photo);

    try {
      if (isEditing) {
        await axios.put(`/salesman/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Salesman updated successfully!");
      } else {
        await axios.post("/salesman", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Salesman saved successfully!");
      }

      setFormData({
        name: "",
        designation: "",
        mobile: "",
        email: "",
        city: "",
        address: "",
        alternateMobile: "",
        username: "",
        password: "",
      });
      setPhoto(null);
      navigate("/display-salesman");
    } catch (err) {
      console.error("Error saving salesman:", err);
      alert("Error saving salesman.");
    }
  };

  return (
    <Container>
      <h3 className="my-4">Add Salesman</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Alternate Mobile</Form.Label>
              <Form.Control
                type="text"
                name="alternateMobile"
                value={formData.alternateMobile}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control type="file" onChange={handlePhotoChange} />
              {isEditing && existingPhoto && (
                <div className="mt-2">
                  <img
                    src={`${IMAGE_BASE}/Images/${existingPhoto}`}
                    alt="Salesman"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Save Salesman
        </Button>
      </Form>
    </Container>
  );
}

export default AddSalesMan;
