// import React, { useEffect, useState } from "react";
// import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
// import axios from "../../Config/axios";
// import { ToastContainer, toast } from "react-toastify";

// function AddCustomer({ refresh, editingCustomer, setEditingCustomer }) {
//   const [customer, setCustomer] = useState({
//     firm: "",
//     name: "",
//     mobile: "",
//     alternateMobile: "",
//     email: "",
//     whatsapp: "",
//     designation: "",
//     city: "",
//     address: "",
//     creditLimit: "",
//     gstNumber: "",
//     creditDay: "",
//   });

//   useEffect(() => {
//     if (editingCustomer) {
//       setCustomer({
//         firm: editingCustomer.firm || "",
//         name: editingCustomer.name || "",
//         designation: editingCustomer.designation || "",
//         city: editingCustomer.city || "",
//         mobile: editingCustomer.mobile || "",
//         alternateMobile: editingCustomer.alternateMobile || "",
//         email: editingCustomer.email || "",
//         whatsapp: editingCustomer.whatsapp || "",
//         address: editingCustomer.address || "",
//         gstNumber: editingCustomer.gstNumber || "",
//         creditLimit: editingCustomer.creditLimit || "",
//         creditDay: editingCustomer.creditDay?.slice(0, 10) || "",
//       });
//     }
//   }, [editingCustomer]);

//   const handleChange = (e) => {
//     setCustomer({ ...customer, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingCustomer) {
//         await axios.put(`/customer/${editingCustomer._id}`, customer);
//         toast.success("Customer updated successfully!");
//       } else {
//         await axios.post("/customer", customer);
//         toast.success("Customer saved successfully!");
//       }

//       setCustomer({
//         firm: "",
//         name: "",
//         designation: "",
//         city: "",
//         mobile: "",
//         alternateMobile: "",
//         email: "",
//         whatsapp: "",
//         address: "",
//         gstNumber: "",
//         creditLimit: "",
//         creditDay: "",
//       });
//       setEditingCustomer(null);
//       if (refresh) refresh();
//     } catch (error) {
//       toast.error("Failed to save customer.");
//       console.error("Error saving customer:", error);
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
//                 <Form.Label>Firm</Form.Label>
//                 <Form.Control
//                   name='firm'
//                   type='text'
//                   placeholder='Enter Firm Name'
//                   value={customer.firm}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//               <Col md={6} className='mb-3'>
//                 <Form.Label>Contract Person</Form.Label>
//                 <Form.Control
//                   name='name'
//                   placeholder='Contact Person'
//                   value={customer.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Designation</Form.Label>
//                 <Form.Control
//                   name='designation'
//                   placeholder='Designation'
//                   value={customer.designation}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Mobile Number</Form.Label>
//                 <Form.Control
//                   name='mobile'
//                   placeholder='Mobile'
//                   value={customer.mobile}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Alternate Mobile</Form.Label>
//                 <Form.Control
//                   name='alternateMobile'
//                   placeholder='Alternate Mobile'
//                   value={customer.alternateMobile}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   name='email'
//                   placeholder='Email'
//                   value={customer.email}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>WhatsApp No.</Form.Label>
//                 <Form.Control
//                   name='whatsapp'
//                   placeholder='WhatsApp'
//                   value={customer.whatsapp}
//                   onChange={handleChange}
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

//               <Col md={12} className='mb-3'>
//                 <Form.Label>Address</Form.Label>
//                 <Form.Control
//                   name='address'
//                   placeholder='Address'
//                   value={customer.address}
//                   onChange={handleChange}
//                 />
//               </Col>

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
// !--------------
// import React, { useEffect, useState } from "react";
// import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
// import axios from "../../Config/axios";
// import { ToastContainer, toast } from "react-toastify";

// function AddCustomer({ refresh, editingCustomer, setEditingCustomer }) {
//   const [customer, setCustomer] = useState({
//     firm: "",
//     name: "",
//     mobile: "",
//     alternateMobile: "",
//     email: "",
//     whatsapp: "",
//     designation: "",
//     city: "",
//     address: "",
//     creditLimit: "",
//     gstNumber: "",
//     creditDay: "",
//     beat: [{ areaName: "" }], // Initializing with one empty beat field
//   });

//   // useEffect(() => {
//   //   if (editingCustomer) {
//   //     setCustomer({
//   //       firm: editingCustomer.firm || "",
//   //       name: editingCustomer.name || "",
//   //       designation: editingCustomer.designation || "",
//   //       city: editingCustomer.city || "",
//   //       mobile: editingCustomer.mobile || "",
//   //       alternateMobile: editingCustomer.alternateMobile || "",
//   //       email: editingCustomer.email || "",
//   //       whatsapp: editingCustomer.whatsapp || "",
//   //       address: editingCustomer.address || "",
//   //       gstNumber: editingCustomer.gstNumber || "",
//   //       creditLimit: editingCustomer.creditLimit || "",
//   //       // Ensure creditDay is formatted correctly for date input
//   //       creditDay: editingCustomer.creditDay
//   //         ? editingCustomer.creditDay.slice(0, 10)
//   //         : "",
//   //       // FIX: Ensure beat data is loaded from editingCustomer
//   //       beat:
//   //         editingCustomer.beat && editingCustomer.beat.length > 0
//   //           ? editingCustomer.beat
//   //           : [{ areaName: "" }], // If no beats, provide one empty field for input
//   //     });
//   //   }
//   // }, [editingCustomer]);

//   useEffect(() => {
//     console.log("useEffect triggered. editingCustomer:", editingCustomer); // See what editingCustomer contains
//     if (editingCustomer) {
//       console.log("editingCustomer.beat from API:", editingCustomer.beat); // Crucial: check the actual data
//       setCustomer({
//         firm: editingCustomer.firm || "",
//         name: editingCustomer.name || "",
//         designation: editingCustomer.designation || "",
//         city: editingCustomer.city || "",
//         mobile: editingCustomer.mobile || "",
//         alternateMobile: editingCustomer.alternateMobile || "",
//         email: editingCustomer.email || "",
//         whatsapp: editingCustomer.whatsapp || "",
//         address: editingCustomer.address || "",
//         gstNumber: editingCustomer.gstNumber || "",
//         creditLimit: editingCustomer.creditLimit || "",
//         creditDay: editingCustomer.creditDay
//           ? editingCustomer.creditDay.slice(0, 10)
//           : "",
//         // THIS IS THE CRITICAL LINE
//         beat:
//           editingCustomer.beat &&
//           Array.isArray(editingCustomer.beat) &&
//           editingCustomer.beat.length > 0
//             ? editingCustomer.beat
//             : [{ areaName: "" }],
//       });
//       console.log("Customer state after setting (beat):", customer.beat); // Check what's set in state
//     }
//   }, [editingCustomer]);

//   const handleChange = (e) => {
//     setCustomer({ ...customer, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Filter out any empty beat objects before sending to API
//       const customerToSubmit = {
//         ...customer,
//         beat: customer.beat.filter((b) => b.areaName.trim() !== ""), // Remove empty beat entries
//       };

//       // If all beat entries are empty, send an empty array or handle as per backend
//       if (customerToSubmit.beat.length === 0) {
//         // You might want to send an empty array or null, depending on your API's expectation
//         // For now, let's ensure it's at least an empty array if filtered out
//         customerToSubmit.beat = [];
//       }
//       console.log(customerToSubmit, "OPTIONS");

//       if (editingCustomer) {
//         await axios.put(`/customer/${editingCustomer._id}`, customerToSubmit);
//         toast.success("Customer updated successfully!");
//       } else {
//         await axios.post("/customer", customerToSubmit);
//         toast.success("Customer saved successfully!");
//       }

//       // Reset form after successful submission
//       setCustomer({
//         firm: "",
//         name: "",
//         designation: "",
//         city: "",
//         mobile: "",
//         alternateMobile: "",
//         email: "",
//         whatsapp: "",
//         address: "",
//         gstNumber: "",
//         creditLimit: "",
//         creditDay: "",
//         beat: [{ areaName: "" }], // Reset beat to one empty field for new entries
//       });
//       setEditingCustomer(null); // Clear editing state
//       if (refresh) refresh(); // Refresh parent component data
//     } catch (error) {
//       toast.error("Failed to save customer.");
//       console.error("Error saving customer:", error);
//     }
//   };

//   const handleBeatChange = (index, field, value) => {
//     const updatedBeats = [...customer.beat];
//     updatedBeats[index] = {
//       ...updatedBeats[index],
//       [field]: value,
//     };
//     setCustomer((prev) => ({ ...prev, beat: updatedBeats }));
//   };

//   const addBeatField = () => {
//     setCustomer((prev) => ({
//       ...prev,
//       beat: [...prev.beat, { areaName: "" }],
//     }));
//   };

//   const removeBeatField = (index) => {
//     const updatedBeats = customer.beat.filter((_, i) => i !== index);
//     // Ensure there's always at least one beat field if all are removed
//     // This provides a persistent input field for the user
//     if (updatedBeats.length === 0) {
//       setCustomer((prev) => ({ ...prev, beat: [{ areaName: "" }] }));
//     } else {
//       setCustomer((prev) => ({ ...prev, beat: updatedBeats }));
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
//                 <Form.Label>Firm</Form.Label>
//                 <Form.Control
//                   name='firm'
//                   type='text'
//                   placeholder='Enter Firm Name'
//                   value={customer.firm}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//               <Col md={6} className='mb-3'>
//                 <Form.Label>Contract Person</Form.Label>
//                 <Form.Control
//                   name='name'
//                   placeholder='Contact Person'
//                   value={customer.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Designation</Form.Label>
//                 <Form.Control
//                   name='designation'
//                   placeholder='Designation'
//                   value={customer.designation}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Mobile Number</Form.Label>
//                 <Form.Control
//                   name='mobile'
//                   placeholder='Mobile'
//                   value={customer.mobile}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Alternate Mobile</Form.Label>
//                 <Form.Control
//                   name='alternateMobile'
//                   placeholder='Alternate Mobile'
//                   value={customer.alternateMobile}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   name='email'
//                   placeholder='Email'
//                   value={customer.email}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={6} className='mb-3'>
//                 <Form.Label>WhatsApp No.</Form.Label>
//                 <Form.Control
//                   name='whatsapp'
//                   placeholder='WhatsApp'
//                   value={customer.whatsapp}
//                   onChange={handleChange}
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

//               <Col md={12} className='mb-3'>
//                 <Form.Label>Address</Form.Label>
//                 <Form.Control
//                   name='address'
//                   placeholder='Address'
//                   value={customer.address}
//                   onChange={handleChange}
//                 />
//               </Col>

//               {/* Start of enhanced Beats section */}
//               <Form.Group as={Col} md={12} className='mb-3'>
//                 <Form.Label>Beats</Form.Label>
//                 {customer.beat.map((b, index) => (
//                   <Row key={index} className='mb-2 align-items-center'>
//                     <Col md={10}>
//                       {" "}
//                       {/* Adjusted column width for the input */}
//                       <Form.Control
//                         type='text'
//                         placeholder='Area Name'
//                         value={b.areaName}
//                         onChange={(e) =>
//                           handleBeatChange(index, "areaName", e.target.value)
//                         }
//                       />
//                     </Col>
//                     <Col md={2}>
//                       {" "}
//                       {/* Column for buttons */}
//                       {/* Show remove button if there's more than one beat field */}
//                       {customer.beat.length > 1 && (
//                         <Button
//                           variant='danger'
//                           onClick={() => removeBeatField(index)}
//                           className='me-2' // Margin right for spacing
//                         >
//                           ❌
//                         </Button>
//                       )}
//                       {/* Show add button only on the last beat field */}
//                       {index === customer.beat.length - 1 && (
//                         <Button variant='secondary' onClick={addBeatField}>
//                           ➕
//                         </Button>
//                       )}
//                     </Col>
//                   </Row>
//                 ))}
//               </Form.Group>
//               {/* End of enhanced Beats section */}

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


// !0-------------


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
    beats: [{ areaName: "" }], // Initializing with one empty beat field
  });

  useEffect(() => {
    console.log("--- useEffect Triggered ---");
    console.log("1. editingCustomer prop received:", editingCustomer);

    if (editingCustomer) {
      console.log("2. Inside if (editingCustomer) block.");
      console.log("3. editingCustomer.beats from API:", editingCustomer.beats); // THIS IS THE MOST IMPORTANT LOG

      // Step 1: Check if editingCustomer.beats exists and is an array
      let formattedBeats;
      if (editingCustomer.beats && Array.isArray(editingCustomer.beats)) {
        // Step 2: Map each string in 'beats' to an object { areaName: string }
        formattedBeats = editingCustomer.beats.map(area => ({ areaName: area }));
        console.log("4. Formatted beats for state (after mapping):", formattedBeats);
      } else {
        // Step 3: Fallback if beats is missing or not an array
        formattedBeats = [{ areaName: "" }];
        console.log("4. Falling back to default beats:", formattedBeats);
      }

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
        creditDay: editingCustomer.creditDay ? editingCustomer.creditDay.slice(0, 10) : "",
        beats: formattedBeats, // Set the formatted beats
      });

      // You might not see the immediate effect of setCustomer here due to async state updates,
      // but the logs above are what's critical for diagnosing.
      console.log("5. setCustomer called with new state (check React DevTools for actual state update).");
    } else {
        console.log("2. editingCustomer is null or undefined. Form is in 'Add' mode.");
    }
    console.log("--------------------------");
  }, [editingCustomer]); // Dependency array: useEffect runs when editingCustomer changes

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out any empty beat objects and convert back to array of strings for API
      const beatsForApi = customer.beats
        .filter(b => b.areaName.trim() !== '') // Remove empty beat entries
        .map(b => b.areaName); // Convert objects back to strings

      const customerToSubmit = {
        ...customer,
        beats: beatsForApi, // Use the converted array of strings
      };

      console.log("Submitting customer data:", customerToSubmit); // Log data before API call

      if (editingCustomer) {
        await axios.put(`/customer/${editingCustomer._id}`, customerToSubmit);
        toast.success("Customer updated successfully!");
      } else {
        await axios.post("/customer", customerToSubmit);
        toast.success("Customer saved successfully!");
      }

      // Reset form after successful submission
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
        beats: [{ areaName: "" }], // Reset beat to one empty field for new entries
      });
      setEditingCustomer(null); // Clear editing state
      if (refresh) refresh(); // Refresh parent component data
    } catch (error) {
      toast.error("Failed to save customer.");
      console.error("Error saving customer:", error);
    }
  };

  const handleBeatChange = (index, field, value) => {
    const updatedBeats = [...customer.beats]; // Use customer.beats
    updatedBeats[index] = {
      ...updatedBeats[index],
      [field]: value,
    };
    setCustomer((prev) => ({ ...prev, beats: updatedBeats })); // Use beats
  };

  const addBeatField = () => {
    setCustomer((prev) => ({
      ...prev,
      beats: [...prev.beats, { areaName: "" }], // Use beats
    }));
  };

  const removeBeatField = (index) => {
    const updatedBeats = customer.beats.filter((_, i) => i !== index); // Use customer.beats
    if (updatedBeats.length === 0) {
      setCustomer((prev) => ({ ...prev, beats: [{ areaName: "" }] })); // Use beats
    } else {
      setCustomer((prev) => ({ ...prev, beats: updatedBeats })); // Use beats
    }
  };

  return (
    <Container className='mt-4'>
      <Card>
        <Card.Header>{editingCustomer ? "Edit" : "Add"} Customer</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className='mb-3'>
                <Form.Label>Firm</Form.Label>
                <Form.Control
                  name='firm'
                  type='text'
                  placeholder='Enter Firm Name'
                  value={customer.firm}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6} className='mb-3'>
                <Form.Label>Contract Person</Form.Label>
                <Form.Control
                  name='name'
                  placeholder='Contact Person'
                  value={customer.name}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  name='designation'
                  placeholder='Designation'
                  value={customer.designation}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  name='mobile'
                  placeholder='Mobile'
                  value={customer.mobile}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>Alternate Mobile</Form.Label>
                <Form.Control
                  name='alternateMobile'
                  placeholder='Alternate Mobile'
                  value={customer.alternateMobile}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name='email'
                  placeholder='Email'
                  value={customer.email}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className='mb-3'>
                <Form.Label>WhatsApp No.</Form.Label>
                <Form.Control
                  name='whatsapp'
                  placeholder='WhatsApp'
                  value={customer.whatsapp}
                  onChange={handleChange}
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

              <Col md={12} className='mb-3'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name='address'
                  placeholder='Address'
                  value={customer.address}
                  onChange={handleChange}
                />
              </Col>

              {/* Beats section */}
              <Form.Group as={Col} md={12} className='mb-3'>
                <Form.Label>Beats</Form.Label>
                {/* Ensure customer.beats is always an array before mapping */}
                {customer.beats && customer.beats.map((b, index) => (
                  <Row key={index} className='mb-2 align-items-center'>
                    <Col md={10}>
                      <Form.Control
                        type='text'
                        placeholder='Area Name'
                        value={b.areaName} // This should now correctly access the 'areaName' property
                        onChange={(e) =>
                          handleBeatChange(index, "areaName", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      {customer.beats.length > 1 && (
                        <Button
                          variant='danger'
                          onClick={() => removeBeatField(index)}
                          className='me-2'
                        >
                          ❌
                        </Button>
                      )}
                      {index === customer.beats.length - 1 && (
                        <Button
                          variant='secondary'
                          onClick={addBeatField}
                        >
                          ➕
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
              </Form.Group>

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
