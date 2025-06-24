import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "../../Config/axios";
import { ToastContainer, toast } from "react-toastify";
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
      <ToastContainer />
    </Container>
  );
}

export default AddCustomer;

// !0-------------

// import React, { useEffect, useState } from "react";
// import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
// import axios from "../../Config/axios";
// import { ToastContainer, toast } from "react-toastify";

// function AddCustomer({ refresh, editingCustomer, setEditingCustomer }) {
//   const [customer, setCustomer] = useState({
//     ledger: "",
//     name: "",
//     mobile: "",
//     city: "",
//     address1: "",
//     creditLimit: "",
//     gstNumber: "",
//     creditDay: "",
//     // beats: [{ areaName: "" }], // Initializing with one empty beat field
//     area: "",
//   });

//   useEffect(() => {
//     // console.log("--- useEffect Triggered ---");
//     // console.log("1. editingCustomer prop received:", editingCustomer);

//     if (editingCustomer) {
//       // Step 1: Check if editingCustomer.beats exists and is an array
//       let formattedBeats;
//       if (editingCustomer.beats && Array.isArray(editingCustomer.beats)) {
//         // Step 2: Map each string in 'beats' to an object { areaName: string }
//         formattedBeats = editingCustomer.beats.map((area) => ({
//           areaName: area,
//         }));
//         console.log(
//           "4. Formatted beats for state (after mapping):",
//           formattedBeats
//         );
//       } else {
//         // Step 3: Fallback if beats is missing or not an array
//         formattedBeats = [{ areaName: "" }];
//         console.log("4. Falling back to default beats:", formattedBeats);
//       }

//       setCustomer({
//         ledger: editingCustomer.ledger || "",
//         name: editingCustomer.name || "",
//         designation: editingCustomer.designation || "",
//         city: editingCustomer.city || "",
//         mobile: editingCustomer.mobile || "",
//         alternateMobile: editingCustomer.alternateMobile || "",
//         email: editingCustomer.email || "",
//         whatsapp: editingCustomer.whatsapp || "",
//         address1: editingCustomer.address1 || "",
//         gstNumber: editingCustomer.gstNumber || "",
//         creditLimit: editingCustomer.creditLimit || "",
//         creditDay: editingCustomer.creditDay
//           ? editingCustomer.creditDay.slice(0, 10)
//           : "",
//         beats: formattedBeats, // Set the formatted beats
//       });

//       // You might not see the immediate effect of setCustomer here due to async state updates,
//       // but the logs above are what's critical for diagnosing.
//       console.log(
//         "5. setCustomer called with new state (check React DevTools for actual state update)."
//       );
//     } else {
//       console.log(
//         "2. editingCustomer is null or undefined. Form is in 'Add' mode."
//       );
//     }
//     console.log("--------------------------");
//   }, [editingCustomer]); // Dependency array: useEffect runs when editingCustomer changes

//   const handleChange = (e) => {
//     setCustomer({ ...customer, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("Submitting customer data:", customer); // Log data before API call

//       if (editingCustomer) {
//         await axios.put(`/customer/${editingCustomer._id}`, customer);
//         toast.success("Customer updated successfully!");
//       } else {
//         await axios.post("/customer", customer);
//         toast.success("Customer saved successfully!");
//       }

//       // Reset form after successful submission
//       // Reset form after successful submission
//       // Reset form after successful submission
//       setCustomer({
//         ledger: "",
//         name: "",
//         designation: "",
//         city: "",
//         mobile: "",
//         alternateMobile: "",
//         email: "",
//         whatsapp: "",
//         address1: "",
//         gstNumber: "",
//         creditLimit: "",
//         area: "",
//         creditDay: "",
//         // beats: [{ areaName: "" }], // Reset beat to one empty field for new entries
//       });
//       setEditingCustomer(null); // Clear editing state
//       if (refresh) refresh(); // Refresh parent component data
//     } catch (error) {
//       toast.error("Failed to save customer.");
//       console.error("Error saving customer:", error);
//     }
//   };

//   const handleBeatChange = (index, field, value) => {
//     const updatedBeats = [...customer.beats]; // Use customer.beats
//     updatedBeats[index] = {
//       ...updatedBeats[index],
//       [field]: value,
//     };
//     setCustomer((prev) => ({ ...prev, beats: updatedBeats })); // Use beats
//   };

//   const addBeatField = () => {
//     setCustomer((prev) => ({
//       ...prev,
//       beats: [...prev.beats, { areaName: "" }], // Use beats
//     }));
//   };

//   const removeBeatField = (index) => {
//     const updatedBeats = customer.beats.filter((_, i) => i !== index); // Use customer.beats
//     if (updatedBeats.length === 0) {
//       setCustomer((prev) => ({ ...prev, beats: [{ areaName: "" }] })); // Use beats
//     } else {
//       setCustomer((prev) => ({ ...prev, beats: updatedBeats })); // Use beats
//     }
//   };

//   return (
//     <Container className='mt-4'>
//       <Card>
//         <Card.Header>{editingCustomer ? "Edit" : "Add"} Customer</Card.Header>
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={6} className='mb-3'>
//                 <Form.Label>
//                   Firm <span style={{ color: "red" }}>*</span>
//                 </Form.Label>
//                 <Form.Control
//                   name='ledger'
//                   type='text'
//                   placeholder='Enter Firm Name'
//                   value={customer.firm}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>
//                   Mobile Number <span style={{ color: "red" }}>*</span>
//                 </Form.Label>
//                 <Form.Control
//                   name='mobile'
//                   placeholder='Mobile'
//                   value={customer.mobile}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>City</Form.Label>
//                 <Form.Control
//                   name='city'
//                   placeholder='City'
//                   value={customer.city}
//                   onChange={handleChange}
//                 />
//               </Col>

//               {/* //! --------------------------------------------------------------------------- */}
//               <Form.Group as={Col} md={6} className='mb-3'>
//                 <Form.Label>
//                   Area <span style={{ color: "red" }}>*</span>
//                 </Form.Label>

//                 <Col md={10}>
//                   <Form.Control
//                     type='text'
//                     placeholder='Area Name'
//                     name='area'
//                     value={customer.area} // This should now correctly access the 'areaName' property
//                     // onChange={(e) =>
//                     //   handleBeatChange(index, "areaName", e.target.value)
//                     // }
//                     onChange={handleChange}
//                   />
//                 </Col>

//                 {/*
//                 {customer.beats &&
//                   customer.beats.map((b, index) => (
//                     <Row key={index} className='mb-2 align-items-center'>
//                       <Col md={10}>
//                         <Form.Control
//                           type='text'
//                           placeholder='Area Name'
//                           value={b.areaName} // This should now correctly access the 'areaName' property
//                           onChange={(e) =>
//                             handleBeatChange(index, "areaName", e.target.value)
//                           }
//                         />
//                       </Col>
//                     </Row>
//                   ))} */}
//               </Form.Group>

//               {/* //! --------------------------------------------------------------------------- */}

//               <Col md={12} className='mb-3'>
//                 <Form.Label>Address</Form.Label>
//                 <Form.Control
//                   name='address1'
//                   placeholder='Address'
//                   value={customer.address1}
//                   onChange={handleChange}
//                 />
//               </Col>

//               {/* Beats section */}

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Credit Limit</Form.Label>
//                 <Form.Control
//                   type='number'
//                   name='creditLimit'
//                   placeholder='Credit Limit'
//                   value={customer.creditLimit}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Credit Day</Form.Label>
//                 <Form.Control
//                   type='date'
//                   name='creditDay'
//                   value={customer.creditDay}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>GST No.</Form.Label>
//                 <Form.Control
//                   name='gstNumber'
//                   placeholder='GST No.'
//                   value={customer.gstNumber}
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>
//             <Button type='submit' variant='primary'>
//               {editingCustomer ? "Update Customer" : "Add Customer"}
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//       <ToastContainer />
//     </Container>
//   );
// }

// export default AddCustomer;
