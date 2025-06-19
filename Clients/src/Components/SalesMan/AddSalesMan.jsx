// import React, { useEffect, useState } from "react";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import axios from "../../Config/axios";
// import { useNavigate, useParams } from "react-router-dom";
// const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");

// function AddSalesMan() {
//   const [formData, setFormData] = useState({
//     name: "",
//     designation: "",
//     mobile: "",
//     email: "",
//     city: "",
//     address: "",
//     alternateMobile: "",
//     username: "",
//     password: "",
//     beat: [{ areaName: "", pinCode: "" }], // Start with one row
//   });

//   // update
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const [existingPhoto, setExistingPhoto] = useState(null);
//   const [photo, setPhoto] = useState(null);

//   useEffect(() => {
//     if (id) {
//       setIsEditing(true);
//       axios.get(`/salesman/${id}`).then((res) => {
//         const s = res.data;
//         setFormData({
//           name: s.name || "",
//           designation: s.designation || "",
//           mobile: s.mobile || "",
//           email: s.email || "",
//           city: s.city || "",
//           address: s.address || "",
//           alternateMobile: s.alternateMobile || "",
//           username: s.username || "",
//           password: s.password || "", // pre-fill password (only if you store plaintext, which is not secure)
//           beat: Array.isArray(s.beat) ? s.beat : [s.beat || ""], // ✅
//         });
//         setExistingPhoto(s.photo); // Set image
//       });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     setPhoto(e.target.files[0]);
//   };

//   // !
//   const handleBeatChange = (index, value) => {
//     const updatedBeats = [...formData.beat];
//     updatedBeats[index] = value;
//     setFormData((prev) => ({ ...prev, beat: updatedBeats }));
//   };

//   const addBeatField = () => {
//     setFormData((prev) => ({
//       ...prev,
//       beat: [...prev.beat, { areaName: "", pinCode: "" }],
//     }));
//   };

//   const removeBeatField = (index) => {
//     const updatedBeats = formData.beat.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, beat: updatedBeats }));
//   };

//   // !

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const data = new FormData();
//   //   Object.entries(formData).forEach(([key, value]) => {
//   //     data.append(key, value);
//   //   });
//   //   if (photo) data.append("photo", photo);

//   //   try {
//   //     if (isEditing) {
//   //       await axios.put(`/salesman/${id}`, data, {
//   //         headers: { "Content-Type": "multipart/form-data" },
//   //       });
//   //       alert("Salesman updated successfully!");
//   //     } else {
//   //       await axios.post("/salesman", data, {
//   //         headers: { "Content-Type": "multipart/form-data" },
//   //       });
//   //       alert("Salesman saved successfully!");
//   //     }

//   //     setFormData({
//   //       name: "",
//   //       designation: "",
//   //       mobile: "",
//   //       email: "",
//   //       city: "",
//   //       address: "",
//   //       alternateMobile: "",
//   //       username: "",
//   //       password: "",
//   //       beat: "",
//   //     });
//   //     setPhoto(null);
//   //     navigate("/display-salesman");
//   //   } catch (err) {
//   //     console.error("Error saving salesman:", err);
//   //     alert("Error saving salesman.");
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();

//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === "beat") {
//         // 👇 convert array of objects to array of strings (areaName only)
//         const onlyAreaNames = value.map((b) => b.areaName);
//         data.append("beat", JSON.stringify(onlyAreaNames));
//       } else {
//         data.append(key, value);
//       }
//     });
//     if (photo) data.append("photo", photo);
//     // console.log(data, "OPTIONS");

//     try {
//       if (isEditing) {
//         await axios.put(`/salesman/${id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Salesman updated successfully!");
//       } else {
//         await axios.post("/salesman", data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Salesman saved successfully!");
//       }

//       // Reset form
//       setFormData({
//         name: "",
//         designation: "",
//         mobile: "",
//         email: "",
//         city: "",
//         address: "",
//         alternateMobile: "",
//         username: "",
//         password: "",
//         beat: [{ areaName: "", pinCode: "" }], // ✅ correct reset
//       });
//       setPhoto(null);
//       navigate("/display-salesman");
//     } catch (err) {
//       console.error("Error saving salesman:", err);
//       alert("Error saving salesman.");
//     }
//   };

//   return (
//     <Container>
//       <h3 className='my-4'>Add Salesman</h3>
//       <Form onSubmit={handleSubmit}>
//         <Row>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='name'
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           {/* <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Designation</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='designation'
//                 value={formData.designation}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col> */}
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Mobile</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='mobile'
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           {/* <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type='email'
//                 name='email'
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col> */}
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>City</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='city'
//                 value={formData.city}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           {/* <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Beat</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='beat'
//                 value={formData.beat}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col> */}

//           <Form.Group className='mb-3'>
//             <Form.Label>Beats</Form.Label>

//             {formData.beat.map((b, index) => (
//               <Row key={index} className='mb-2'>
//                 <Col md={5}>
//                   <Form.Control
//                     type='text'
//                     placeholder='Area Name'
//                     value={b.areaName}
//                     onChange={(e) => {
//                       const updated = [...formData.beat];
//                       updated[index].areaName = e.target.value;
//                       setFormData((prev) => ({ ...prev, beat: updated }));
//                     }}
//                   />
//                 </Col>
//                 {/* <Col md={5}>
//                   <Form.Control
//                     type='text'
//                     placeholder='Pin Code'
//                     value={b.pinCode}
//                     onChange={(e) => {
//                       const updated = [...formData.beat];
//                       updated[index].pinCode = e.target.value;
//                       setFormData((prev) => ({ ...prev, beat: updated }));
//                     }}
//                   />
//                 </Col> */}
//                 <Col md={2}>
//                   <Button
//                     variant='danger'
//                     onClick={() => {
//                       const updated = formData.beat.filter(
//                         (_, i) => i !== index
//                       );
//                       setFormData((prev) => ({ ...prev, beat: updated }));
//                     }}
//                   >
//                     ❌
//                   </Button>
//                 </Col>
//               </Row>
//             ))}

//             <Button
//               variant='secondary'
//               onClick={() =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   beat: [...prev.beat, { areaName: "", pinCode: "" }],
//                 }))
//               }
//             >
//               ➕ Add Beat
//             </Button>
//           </Form.Group>

//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='address'
//                 value={formData.address}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Alternate Mobile</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='alternateMobile'
//                 value={formData.alternateMobile}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Photo</Form.Label>
//               <Form.Control type='file' onChange={handlePhotoChange} />
//               {isEditing && existingPhoto && (
//                 <div className='mt-2'>
//                   <img
//                     src={`${IMAGE_BASE}/Images/${existingPhoto}`}
//                     alt='Salesman'
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               )}
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='username'
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type='password'
//                 name='password'
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <Button variant='primary' type='submit'>
//           Save Salesman
//         </Button>
//       </Form>
//     </Container>
//   );
// }

// export default AddSalesMan;

// !-------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import axios from "../../Config/axios"; // Assuming this path is correct
// import { useNavigate, useParams } from "react-router-dom";

// // Ensure this environment variable is correctly set
// const IMAGE_BASE = import.meta.env.VITE_API
//   ? import.meta.env.VITE_API.replace(/\/api$/, "")
//   : "";

// function AddSalesMan() {
//   const [formData, setFormData] = useState({
//     name: "",
//     designation: "",
//     mobile: "",
//     email: "",
//     city: "",
//     address: "",
//     alternateMobile: "",
//     username: "",
//     password: "",
//     beat: [{ areaName: "", pinCode: "" }], // Initial state with one empty beat object
//   });

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const [existingPhoto, setExistingPhoto] = useState(null);
//   const [photo, setPhoto] = useState(null); // State to hold the new photo file

//   useEffect(() => {
//     if (id) {
//       setIsEditing(true);
//       axios
//         .get(`/salesman/${id}`)
//         .then((res) => {
//           const s = res.data;
//           setFormData({
//             name: s.name || "",
//             designation: s.designation || "",
//             mobile: s.mobile || "",
//             email: s.email || "",
//             city: s.city || "",
//             address: s.address || "",
//             alternateMobile: s.alternateMobile || "",
//             username: s.username || "",
//             password: s.password || "", // Be cautious about pre-filling passwords in a real app
//             // Ensure 'beat' is always an array of objects, even if backend sends a single string or null
//             beat:
//               Array.isArray(s.beat) && s.beat.length > 0
//                 ? s.beat
//                 : [{ areaName: "", pinCode: "" }], // Default to one empty beat if not an array or empty
//           });
//           setExistingPhoto(s.photo); // Set existing photo URL
//         })
//         .catch((error) => {
//           console.error("Error fetching salesman data:", error);
//           alert("Error fetching salesman data.");
//         });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     setPhoto(e.target.files[0]); // Get the selected file
//   };

//   const handleBeatChange = (index, field, value) => {
//     const updatedBeats = [...formData.beat]; // Create a copy of the beat array
//     updatedBeats[index] = {
//       ...updatedBeats[index], // Copy existing properties of the beat object
//       [field]: value, // Update the specific field (areaName or pinCode)
//     };
//     setFormData((prev) => ({ ...prev, beat: updatedBeats }));
//   };

//   const addBeatField = () => {
//     setFormData((prev) => ({
//       ...prev,
//       beat: [...prev.beat, { areaName: "", pinCode: "" }], // Add a new empty beat object
//     }));
//   };

//   const removeBeatField = (index) => {
//     const updatedBeats = formData.beat.filter((_, i) => i !== index); // Filter out the beat at the given index
//     setFormData((prev) => ({ ...prev, beat: updatedBeats }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     const data = new FormData(); // FormData is used for sending file uploads

//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === "beat") {
//         // Correctly stringify the entire array of beat objects
//         data.append("beat", JSON.stringify(value));
//       } else {
//         data.append(key, value);
//       }
//     });

//     if (photo) {
//       data.append("photo", photo); // Append the new photo if selected
//     }

//     // console.log(data, "LION");

//     try {
//       if (isEditing) {
//         await axios.put(`/salesman/${id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" }, // Important for FormData
//         });
//         alert("Salesman updated successfully!");
//       } else {
//         await axios.post("/salesman", data, {
//           headers: { "Content-Type": "multipart/form-data" }, // Important for FormData
//         });
//         alert("Salesman saved successfully!");
//       }

//       // Reset form after successful submission
//       setFormData({
//         name: "",
//         designation: "",
//         mobile: "",
//         email: "",
//         city: "",
//         address: "",
//         alternateMobile: "",
//         username: "",
//         password: "",
//         beat: [{ areaName: "", pinCode: "" }], // Reset to one empty beat
//       });
//       setPhoto(null); // Clear selected photo
//       navigate("/display-salesman"); // Navigate to display page
//     } catch (err) {
//       console.error(
//         "Error saving salesman:",
//         err.response ? err.response.data : err.message
//       );
//       alert(
//         `Error saving salesman: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   return (
//     <Container>
//       <h3 className='my-4'>{isEditing ? "Edit Salesman" : "Add Salesman"}</h3>
//       <Form onSubmit={handleSubmit}>
//         <Row>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='name'
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Mobile</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='mobile'
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type='email'
//                 name='email'
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>City</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='city'
//                 value={formData.city}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='address'
//                 value={formData.address}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Alternate Mobile</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='alternateMobile'
//                 value={formData.alternateMobile}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Photo</Form.Label>
//               <Form.Control type='file' onChange={handlePhotoChange} />
//               {isEditing && existingPhoto && (
//                 <div className='mt-2'>
//                   <p>Current Photo:</p>
//                   <img
//                     src={`${IMAGE_BASE}/Images/${existingPhoto}`}
//                     alt='Salesman'
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               )}
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type='text'
//                 name='username'
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className='mb-3'>
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type='password'
//                 name='password'
//                 value={formData.password}
//                 onChange={handleChange}
//                 required={!isEditing} // Password is required for new entry, optional for edit
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         {/* --- Beat Fields --- */}
//         <hr className='my-4' />
//         <Form.Group className='mb-3'>
//           <Form.Label>Beats</Form.Label>
//           {formData.beat.map((b, index) => (
//             <Row key={index} className='mb-2 align-items-center'>
//               <Col md={5}>
//                 <Form.Control
//                   type='text'
//                   placeholder='Area Name'
//                   value={b.areaName}
//                   onChange={(e) =>
//                     handleBeatChange(index, "areaName", e.target.value)
//                   }
//                 />
//               </Col>
//               <Col md={5}>
//                 <Form.Control
//                   type='text'
//                   placeholder='Pin Code'
//                   value={b.pinCode}
//                   onChange={(e) =>
//                     handleBeatChange(index, "pinCode", e.target.value)
//                   }
//                 />
//               </Col>
//               <Col md={2}>
//                 <Button variant='danger' onClick={() => removeBeatField(index)}>
//                   ❌ Remove
//                 </Button>
//               </Col>
//             </Row>
//           ))}
//           <Button variant='secondary' onClick={addBeatField} className='mt-2'>
//             ➕ Add Beat
//           </Button>
//         </Form.Group>
//         {/* --- End Beat Fields --- */}

//         <Button variant='primary' type='submit' className='mt-4'>
//           {isEditing ? "Update Salesman" : "Save Salesman"}
//         </Button>
//       </Form>
//     </Container>
//   );
// }

// export default AddSalesMan;

// ! -------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "../../Config/axios";
import { useNavigate, useParams } from "react-router-dom";

const IMAGE_BASE = import.meta.env.VITE_API
  ? import.meta.env.VITE_API.replace(/\/api$/, "")
  : "";

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
    beat: [{ areaName: "", pinCode: "" }],
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      axios
        .get(`/salesman/${id}`)
        .then((res) => {
          const s = res.data;

          let parsedBeats = [{ areaName: "", pinCode: "" }]; // Default to an empty beat

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
      beat: [...prev.beat, { areaName: "", pinCode: "" }],
    }));
  };

  const removeBeatField = (index) => {
    const updatedBeats = formData.beat.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, beat: updatedBeats }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        beat: [{ areaName: "", pinCode: "" }],
      });
      setPhoto(null);
      navigate("/display-salesman");
    } catch (err) {
      console.error(
        "Error saving salesman:",
        err.response ? err.response.data : err.message
      );
      alert(
        `Error saving salesman: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <Container>
      <h3 className='my-4'>{isEditing ? "Edit Salesman" : "Add Salesman"}</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
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
                type='text'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          {/* <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col> */}
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>City</Form.Label>
              <Form.Control
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
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Alternate Mobile</Form.Label>
              <Form.Control
                type='text'
                name='alternateMobile'
                value={formData.alternateMobile}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          {/* <hr className='my-4' /> */}
          <Form.Group className='mb-3'>
            <Form.Label>Beats</Form.Label>
            {formData.beat.map((b, index) => (
              <Row key={index} className='mb-2 align-items-center'>
                <Col md={5}>
                  <Form.Control
                    type='text'
                    placeholder='Area Name'
                    value={b.areaName}
                    onChange={(e) =>
                      handleBeatChange(index, "areaName", e.target.value)
                    }
                  />
                </Col>
                {/* <Col md={5}>
                  <Form.Control
                    type='text'
                    placeholder='Pin Code'
                    value={b.pinCode}
                    onChange={(e) =>
                      handleBeatChange(index, "pinCode", e.target.value)
                    }
                  />
                </Col> */}
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
              <Form.Label>Photo</Form.Label>
              <Form.Control type='file' onChange={handlePhotoChange} />
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
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
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
