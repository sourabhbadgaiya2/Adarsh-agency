// ! -------------------------------------------------------------------------------------------------

import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "../../../Config/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../Loader";

const IMAGE_BASE = import.meta.env.VITE_API
  ? import.meta.env.VITE_API.replace(/\/api$/, "")
  : "";

function AddSalesMan({ idToEdit, onSuccess }) {
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
    beat: [{ area: "" }],
  });

  // const { id } = useParams();
  const id = idToEdit;

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      axios
        .get(`/salesman/${id}`)
        .then((res) => {
          const s = res.data;

          let parsedBeats = [{ area: "" }]; // Default to an empty beat

          // --- MODIFICATION STARTS HERE ---
          // Check if s.beat is an array and if its first element is a string
          if (
            Array.isArray(s.beat) &&
            s.beat.length > 0 &&
            typeof s.beat[0] === "string"
          ) {
            try {
              // Attempt to parse the stringified JSON within the array
              const tempBeats = JSON.parse(s.beat[0]);
              // Check if the parsed result is an array and has content
              if (Array.isArray(tempBeats) && tempBeats.length > 0) {
                parsedBeats = tempBeats;
              }
            } catch (e) {
              console.error("Error parsing beat data from backend:", e);
              // Fallback to default if parsing fails
            }
          } else if (Array.isArray(s.beat) && s.beat.length > 0) {
            // This handles cases where backend might send a proper array of objects directly
            parsedBeats = s.beat;
          }
          // --- MODIFICATION ENDS HERE ---

          setFormData({
            name: s.name || "",
            designation: s.designation || "",
            mobile: s.mobile || "",
            email: s.email || "",
            city: s.city || "",
            address: s.address || "",
            alternateMobile: s.alternateMobile || "",
            username: s.username || "",
            password: s.password || "",
            beat: parsedBeats, // Use the parsed (or default) beats
          });
          setExistingPhoto(s.photo);
        })
        .catch((error) => {
          console.error("Error fetching salesman data:", error);
          alert("Error fetching salesman data.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleBeatChange = (index, field, value) => {
    const updatedBeats = [...formData.beat];
    updatedBeats[index] = {
      ...updatedBeats[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, beat: updatedBeats }));
  };

  const addBeatField = () => {
    setFormData((prev) => ({
      ...prev,
      beat: [...prev.beat, { area: "" }],
    }));
  };

  const removeBeatField = (index) => {
    const updatedBeats = formData.beat.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, beat: updatedBeats }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "beat") {
        // Ensure you're sending the full array of objects as a JSON string
        data.append("beat", JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    if (photo) {
      data.append("photo", photo);
    }

    try {
      if (isEditing) {
        await axios.put(`/salesman/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Salesman updated successfully!");
      } else {
        // console.log(data, "SALES DATA");

        await axios.post("/salesman", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Salesman saved successfully!");
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
      if (onSuccess) {
        onSuccess();
      }

      // navigate("/display-salesman");
    } catch (err) {
      console.error(
        "Error saving salesman:",
        err.response ? err.response.data : err.message
      );
      toast.error(
        `Error saving salesman: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, index) => {
    const input = inputRefs.current[index];
    const total = inputRefs.current.length;

    const next = () => {
      const nextIndex = index + 1;
      if (nextIndex < total) inputRefs.current[nextIndex]?.focus();
    };

    const prev = () => {
      const prevIndex = index - 1;
      if (prevIndex >= 0) inputRefs.current[prevIndex]?.focus();
    };

    if (e.key === "Enter") {
      e.preventDefault();
      next();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      prev();
    }

    if (e.ctrlKey && e.key === "q") {
      e.preventDefault();
      handleSubmit(e);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      next();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    }

    if (e.key === "ArrowLeft") {
      try {
        const pos = input.selectionStart;
        if (pos === 0 || pos === null || pos === undefined) {
          e.preventDefault();
          prev();
        }
      } catch {
        e.preventDefault();
        prev();
      }
    }

    if (e.key === "ArrowRight") {
      try {
        const pos = input.selectionStart;
        if (pos === input.value.length || pos === null || pos === undefined) {
          e.preventDefault();
          next();
        }
      } catch {
        e.preventDefault();
        next();
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      {/* <h3 className='my-4'>{isEditing ? "Edit Salesman" : "Add Salesman"}</h3> */}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[0] = el)}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[1] = el)}
                onKeyDown={(e) => handleKeyDown(e, 1)}
                type='text'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Alternate Mobile</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[2] = el)}
                onKeyDown={(e) => handleKeyDown(e, 2)}
                type='text'
                name='alternateMobile'
                value={formData.alternateMobile}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>City</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
                type='text'
                name='city'
                value={formData.city}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[4] = el)}
                onKeyDown={(e) => handleKeyDown(e, 4)}
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type='file'
                onChange={handlePhotoChange}
                ref={(el) => (inputRefs.current[5] = el)}
                onKeyDown={(e) => handleKeyDown(e, 5)}
              />
              {isEditing && existingPhoto && (
                <div className='mt-2'>
                  <p>Current Photo:</p>
                  <img
                    src={`${IMAGE_BASE}/Images/${existingPhoto}`}
                    alt='Salesman'
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

          {/* <hr className='my-4' /> */}
          <Form.Group className='mb-3'>
            <Form.Label>Beats</Form.Label>
            {formData?.beat?.map((b, index) => (
              <Row key={index} className='mb-2 align-items-center'>
                <Col md={5}>
                  <Form.Control
                    type='text'
                    placeholder='Area Name'
                    value={b.area}
                    onChange={(e) =>
                      handleBeatChange(index, "area", e.target.value)
                    }
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant='danger'
                    onClick={() => removeBeatField(index)}
                  >
                    ❌ Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant='secondary' onClick={addBeatField} className='mt-2'>
              ➕ Add Beat
            </Button>
          </Form.Group>

          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[6] = el)}
                onKeyDown={(e) => handleKeyDown(e, 6)}
                type='text'
                name='username'
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[7] = el)}
                onKeyDown={(e) => handleKeyDown(e, 7)}
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant='primary' type='submit' className='mt-4'>
          {isEditing ? "Update Salesman" : "Save Salesman"}
        </Button>
      </Form>
    </Container>
  );
}

export default AddSalesMan;
