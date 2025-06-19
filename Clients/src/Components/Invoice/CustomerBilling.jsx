// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "../../Config/axios";
// import Select from "react-select";

// const getCurrentDate = () => {
//   const today = new Date();
//   return today.toISOString().split("T")[0];
// };

// const CustomerBilling = ({ onDataChange }) => {
//   const [formData, setFormData] = useState({
//     Billdate: getCurrentDate(),
//     advanceAmt: "",
//     paymentMode: "",
//     selectedSalesmanId: null,
//     selectedBeatId: null,
//     selectedCustomerId: null,
//   });

//   const [salesmen, setSalesmen] = useState([]);
//   const [selectedSalesman, setSelectedSalesman] = useState(null);
//   const [beatsOptions, setBeatsOptions] = useState([]);
//   const [selectedBeat, setSelectedBeat] = useState(null);
//   const [customersOptions, setCustomersOptions] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [allCustomers, setAllCustomers] = useState([]);
//   const [allBeatsRaw, setAllBeatsRaw] = useState([]);

//   // Fetch salesmen
//   useEffect(() => {
//     const fetchSalesmen = async () => {
//       try {
//         const response = await axios.get("/salesman");
//         const salesmenData = response.data.Data || response.data;
//         setSalesmen(salesmenData);

//         const uniqueBeats = new Map();
//         salesmenData.forEach((sMan) => {
//           let sManBeats = [];
//           if (Array.isArray(sMan.beat)) {
//             if (typeof sMan.beat[0] === "string") {
//               try {
//                 const parsed = JSON.parse(sMan.beat[0]);
//                 if (Array.isArray(parsed)) sManBeats = parsed;
//               } catch (e) {
//                 console.warn("Error parsing beat string", e);
//               }
//             } else {
//               sManBeats = sMan.beat;
//             }
//           }

//           sManBeats.forEach((beat) => {
//             if (beat._id && !uniqueBeats.has(beat._id)) {
//               uniqueBeats.set(beat._id, {
//                 ...beat,
//                 salesmanId: sMan._id,
//                 salesmanName: sMan.name,
//               });
//             }
//           });
//         });

//         setAllBeatsRaw(Array.from(uniqueBeats.values()));
//       } catch (error) {
//         console.error("Error fetching salesmen:", error);
//       }
//     };
//     fetchSalesmen();
//   }, []);

//   // Fetch customers
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const res = await axios.get("/customer");
//         setAllCustomers(res.data);
//       } catch (err) {
//         console.error("Error fetching customers:", err);
//       }
//     };
//     fetchCustomers();
//   }, []);

//   // Update beat options when salesman is selected
//   useEffect(() => {
//     if (selectedSalesman) {
//       let salesmanBeats = [];
//       if (Array.isArray(selectedSalesman.beat)) {
//         if (typeof selectedSalesman.beat[0] === "string") {
//           try {
//             const parsed = JSON.parse(selectedSalesman.beat[0]);
//             if (Array.isArray(parsed)) salesmanBeats = parsed;
//           } catch (e) {
//             console.warn("Parsing error:", e);
//           }
//         } else {
//           salesmanBeats = selectedSalesman.beat;
//         }
//       }

//       const options = salesmanBeats.map((beat) => ({
//         label: `${beat.areaName} ${beat.pinCode ? `(${beat.pinCode})` : ""}`,
//         value: beat._id,
//         beatObject: { ...beat, salesmanId: selectedSalesman._id },
//       }));

//       setBeatsOptions(options);
//       setSelectedBeat(null);
//       setSelectedCustomer(null);
//       setCustomersOptions([]);
//     } else {
//       setBeatsOptions([]);
//       setSelectedBeat(null);
//       setSelectedCustomer(null);
//       setCustomersOptions([]);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       selectedSalesmanId: selectedSalesman ? selectedSalesman._id : null,
//       selectedBeatId: null,
//       selectedCustomerId: null,
//     }));

//     onDataChange({
//       ...formData,
//       selectedSalesmanId: selectedSalesman ? selectedSalesman._id : null,
//       selectedBeatId: null,
//       selectedCustomerId: null,
//       customerName: "",
//     });
//   }, [selectedSalesman]);

//   // Update customers when beat is selected
//   useEffect(() => {
//     if (selectedBeat) {
//       const filtered = allCustomers.filter((customer) =>
//         customer.beats?.includes(selectedBeat.areaName)
//       );

//       const options = filtered.map((customer) => ({
//         label: customer.firm,
//         value: customer._id,
//         customerObject: customer,
//       }));

//       setCustomersOptions(options);
//       setSelectedCustomer(null);
//     } else {
//       setCustomersOptions([]);
//       setSelectedCustomer(null);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       selectedBeatId: selectedBeat ? selectedBeat._id : null,
//       selectedCustomerId: null,
//     }));

//     onDataChange({
//       ...formData,
//       selectedBeatId: selectedBeat ? selectedBeat._id : null,
//       selectedCustomerId: null,
//       customerName: "",
//     });
//   }, [selectedBeat, allCustomers]);

//   const handleSalesmanSelectChange = (selectedOption) => {
//     setSelectedSalesman(selectedOption?.salesmanObject || null);
//   };

//   // const handleBeatSelectChange = (selectedOption) => {
//   //   if (!selectedOption) {
//   //     setSelectedBeat(null);
//   //     return;
//   //   }

//   //   const beatObj =
//   //     selectedOption.beatObject ||
//   //     allBeatsRaw.find((b) => b._id === selectedOption.value);
//   //   setSelectedBeat(beatObj || null);
//   // };

//   const handleBeatSelectChange = (selectedOption) => {
//     if (!selectedOption) {
//       setSelectedBeat(null);
//       return;
//     }
//     setSelectedBeat(selectedOption.beatObject);
//   };

//   const handleCustomerSelectChange = (selectedOption) => {
//     const customerObj = selectedOption?.customerObject || null;
//     setSelectedCustomer(customerObj);
//     setFormData((prev) => ({
//       ...prev,
//       selectedCustomerId: customerObj?._id || null,
//     }));

//     onDataChange({
//       ...formData,
//       selectedCustomerId: customerObj?._id || null,
//       customerName: customerObj?.firm || "",
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const updatedForm = { ...formData, [name]: value };
//     setFormData(updatedForm);

//     onDataChange({
//       ...updatedForm,
//       selectedSalesmanId: selectedSalesman?._id || null,
//       selectedBeatId: selectedBeat?._id || null,
//       selectedCustomerId: selectedCustomer?._id || null,
//       customerName: selectedCustomer?.firm || "",
//       salesmanName: selectedSalesman?.name || "",
//     });
//   };

//   return (
//     <div className='container mt-4'>
//       <h4 className='mb-4'>Customer Information</h4>
//       <form>
//         <div className='row'>
//           {/* Salesman */}
//           <div className='form-group col-md-6'>
//             <label>
//               <strong>Select Salesman</strong>
//             </label>
//             {/* <Select
//               options={salesmen.map((s) => ({
//                 label: s.name,
//                 value: s._id,
//                 salesmanObject: s,
//               }))}
//               value={
//                 selectedSalesman
//                   ? { label: selectedSalesman.name, value: selectedSalesman._id }
//                   : null
//               }
//               onChange={handleSalesmanSelectChange}
//               placeholder='Select a Salesman...'
//               menuPortalTarget={document.body}
//               styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
//             /> */}

//             <Select
//               options={salesmen.map((s) => ({
//                 label: s.name,
//                 value: s._id,
//                 salesmanObject: s,
//               }))}
//               value={
//                 salesmen
//                   .map((s) => ({
//                     label: s.name,
//                     value: s._id,
//                     salesmanObject: s,
//                   }))
//                   .find((opt) => opt.value === selectedSalesman?._id) || null
//               }
//               onChange={handleSalesmanSelectChange}
//               placeholder='Select a Salesman...'
//               menuPortalTarget={document.body}
//               styles={{
//                 menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//               }}
//             />
//           </div>

//           {/* Beat */}
//           <div className='form-group col-md-6'>
//             <label>
//               <strong>Select Beat</strong>
//             </label>
//             {/* <Select
//               options={beatsOptions}
//               getOptionValue={(o) => o.value}
//               getOptionLabel={(o) => o.label}
//               value={
//                 selectedBeat
//                   ? beatsOptions.find((b) => b.value === selectedBeat._id)
//                   : null
//               }
//               onChange={handleBeatSelectChange}
//               placeholder='Select a Beat...'
//               isDisabled={!selectedSalesman}
//               menuPortalTarget={document.body}
//               styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
//             /> */}
//             <Select
//               options={beatsOptions}
//               getOptionValue={(o) => o.value}
//               getOptionLabel={(o) => o.label}
//               value={
//                 selectedBeat
//                   ? beatsOptions.find((b) => b.value === selectedBeat._id) ||
//                     null
//                   : null
//               }
//               onChange={handleBeatSelectChange}
//               placeholder='Select a Beat...'
//               isDisabled={!selectedSalesman}
//               menuPortalTarget={document.body}
//               styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
//             />
//           </div>

//           {/* Customer */}
//           <div className='form-group col-md-6'>
//             <label>
//               <strong>Select Customer</strong>
//             </label>
//             <Select
//               options={customersOptions}
//               getOptionValue={(o) => o.value}
//               getOptionLabel={(o) => o.label}
//               value={
//                 selectedCustomer
//                   ? customersOptions.find(
//                       (c) => c.value === selectedCustomer._id
//                     )
//                   : null
//               }
//               onChange={handleCustomerSelectChange}
//               placeholder='Select a Customer...'
//               isDisabled={!selectedBeat}
//               menuPortalTarget={document.body}
//               styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
//             />
//           </div>

//           {/* Bill Date */}
//           <div className='form-group col-md-6'>
//             <label>Bill Date</label>
//             <input
//               type='date'
//               className='form-control'
//               name='Billdate'
//               value={formData.Billdate}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           {/* Payment Mode */}
//           <div className='form-group col-md-6'>
//             <label>Payment Mode</label>
//             <select
//               name='paymentMode'
//               className='form-control'
//               value={formData.paymentMode}
//               onChange={handleInputChange}
//             >
//               <option value=''>-- Select Payment Mode --</option>
//               <option value='Cash'>Cash</option>
//               <option value='Card'>Card</option>
//               <option value='UPI'>UPI</option>
//               <option value='Net Banking'>Net Banking</option>
//               <option value='Cheque'>Cheque</option>
//             </select>
//           </div>

//           {/* Advance Amount */}
//           <div className='form-group col-md-6'>
//             <label>Advance Amount</label>
//             <input
//               type='number'
//               className='form-control'
//               name='advanceAmt'
//               value={formData.advanceAmt}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CustomerBilling;

import React, { useEffect, useState, useCallback, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../../Config/axios"; // Assuming this path is correct
import Select from "react-select";

// Helper function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const CustomerBilling = ({ onDataChange, resetTrigger = { resetKey } }) => {
  const isFirstRender = useRef(true); // ✅ add this line

  const [formData, setFormData] = useState({
    Billdate: getCurrentDate(),
    advanceAmt: "",
    paymentMode: "",
    selectedSalesmanId: null,
    selectedBeatId: null,
    selectedCustomerId: null,
  });

  const [salesmen, setSalesmen] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [beatsOptions, setBeatsOptions] = useState([]);
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [customersOptions, setCustomersOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]);
  // allBeatsRaw is currently not directly used in the logic, kept for potential future use.
  // const [allBeatsRaw, setAllBeatsRaw] = useState([]);

  useEffect(() => {
    setFormData({
      Billdate: getCurrentDate(),
      advanceAmt: "",
      paymentMode: "",
      selectedSalesmanId: null,
      selectedBeatId: null,
      selectedCustomerId: null,
    });
    setSelectedSalesman(null);
    setSelectedBeat(null);
    setSelectedCustomer(null);
    setBeatsOptions([]);
    setCustomersOptions([]);
  }, [resetTrigger]); // ✅ this will respond to changes in props.resetTrigger

  // Memoize the data compilation for onDataChange to prevent unnecessary re-renders
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onDataChange({
      ...formData,
      selectedSalesmanId: selectedSalesman?._id || null,
      selectedBeatId: selectedBeat?._id || null,
      selectedCustomerId: selectedCustomer?._id || null,
      customerName: selectedCustomer?.firm || "",
      salesmanName: selectedSalesman?.name || "",
    });
  }, [formData, selectedSalesman, selectedBeat, selectedCustomer]);

  // Function to parse beat data, extracted for reusability
  const parseBeatData = (beatArray) => {
    let parsedBeats = [];
    if (Array.isArray(beatArray)) {
      if (typeof beatArray[0] === "string") {
        try {
          const parsed = JSON.parse(beatArray[0]);
          if (Array.isArray(parsed)) parsedBeats = parsed;
        } catch (e) {
          console.warn("Error parsing beat string:", e);
        }
      } else {
        parsedBeats = beatArray;
      }
    }
    return parsedBeats;
  };

  // Fetch salesmen and populate initial beat data
  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const response = await axios.get("/salesman");
        const salesmenData = response.data.Data || response.data; // Handle potential 'Data' wrapper
        setSalesmen(salesmenData);

        // If you still need a consolidated list of all unique beats, you can keep this.
        // For current logic, it's not strictly necessary.
        // const uniqueBeats = new Map();
        // salesmenData.forEach((sMan) => {
        //   const sManBeats = parseBeatData(sMan.beat);
        //   sManBeats.forEach((beat) => {
        //     if (beat._id && !uniqueBeats.has(beat._id)) {
        //       uniqueBeats.set(beat._id, {
        //         ...beat,
        //         salesmanId: sMan._id,
        //         salesmanName: sMan.name,
        //       });
        //     }
        //   });
        // });
        // setAllBeatsRaw(Array.from(uniqueBeats.values()));
      } catch (error) {
        console.error("Error fetching salesmen:", error);
      }
    };
    fetchSalesmen();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/customer");
        setAllCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []); // Empty dependency array means this runs once on mount

  // Update beat options when salesman is selected
  useEffect(() => {
    if (selectedSalesman) {
      const salesmanBeats = parseBeatData(selectedSalesman.beat);

      const options = salesmanBeats.map((beat) => ({
        label: `${beat.areaName} ${beat.pinCode ? `(${beat.pinCode})` : ""}`,
        value: beat._id,
        beatObject: { ...beat, salesmanId: selectedSalesman._id },
      }));

      setBeatsOptions(options);
      setSelectedBeat(null); // Reset selected beat
      setSelectedCustomer(null); // Reset selected customer
      setCustomersOptions([]); // Clear customer options
    } else {
      // If no salesman is selected, clear all dependent selections
      setBeatsOptions([]);
      setSelectedBeat(null);
      setSelectedCustomer(null);
      setCustomersOptions([]);
    }

    setFormData((prev) => ({
      ...prev,
      selectedSalesmanId: selectedSalesman?._id || null,
      selectedBeatId: null, // Reset beat and customer IDs in form data
      selectedCustomerId: null,
    }));
  }, [selectedSalesman]);

  // Update customers when beat is selected
  useEffect(() => {
    if (selectedBeat) {
      // Assuming customer.beats is an array of areaName strings
      const filtered = allCustomers.filter((customer) =>
        customer.beats?.includes(selectedBeat.areaName)
      );

      const options = filtered.map((customer) => ({
        label: customer.firm,
        value: customer._id,
        customerObject: customer,
      }));

      setCustomersOptions(options);
      setSelectedCustomer(null); // Reset selected customer
    } else {
      setCustomersOptions([]);
      setSelectedCustomer(null);
    }

    setFormData((prev) => ({
      ...prev,
      selectedBeatId: selectedBeat?._id || null,
      selectedCustomerId: null, // Reset customer ID in form data
    }));
  }, [selectedBeat, allCustomers]); // Depend on selectedBeat and allCustomers

  const handleSalesmanSelectChange = (selectedOption) => {
    // If selectedOption is null (clear), set selectedSalesman to null
    setSelectedSalesman(selectedOption?.salesmanObject || null);
  };

  const handleBeatSelectChange = (selectedOption) => {
    // If selectedOption is null (clear), set selectedBeat to null
    setSelectedBeat(selectedOption?.beatObject || null);
  };

  const handleCustomerSelectChange = (selectedOption) => {
    const customerObj = selectedOption?.customerObject || null;
    setSelectedCustomer(customerObj);
    setFormData((prev) => ({
      ...prev,
      selectedCustomerId: customerObj?._id || null,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // compileAndSendData will be called by the useEffect watching formData
  };

  return (
    <div className='container mt-4'>
      <h4 className='mb-4'>Customer Information</h4>
      <form>
        <div className='row'>
          {/* Salesman */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Select Salesman</strong>
            </label>
            <Select
              options={salesmen.map((s) => ({
                label: s.name,
                value: s._id,
                salesmanObject: s,
              }))}
              // Correctly setting the value for react-select
              value={
                selectedSalesman
                  ? {
                      label: selectedSalesman.name,
                      value: selectedSalesman._id,
                    }
                  : null
              }
              onChange={handleSalesmanSelectChange}
              placeholder='Select a Salesman...'
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          {/* Beat */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Select Beat</strong>
            </label>
            <Select
              options={beatsOptions}
              // Correctly setting the value for react-select
              value={
                selectedBeat
                  ? beatsOptions.find((b) => b.value === selectedBeat._id)
                  : null
              }
              onChange={handleBeatSelectChange}
              placeholder='Select a Beat...'
              isDisabled={!selectedSalesman}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* Customer */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Select Customer</strong>
            </label>
            <Select
              options={customersOptions}
              // Correctly setting the value for react-select
              value={
                selectedCustomer
                  ? customersOptions.find(
                      (c) => c.value === selectedCustomer._id
                    )
                  : null
              }
              onChange={handleCustomerSelectChange}
              placeholder='Select a Customer...'
              isDisabled={!selectedBeat}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* Bill Date */}
          <div className='form-group col-md-6'>
            <label>Bill Date</label>
            <input
              type='date'
              className='form-control'
              name='Billdate'
              value={formData.Billdate}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Payment Mode */}
          <div className='form-group col-md-6'>
            <label>Payment Mode</label>
            <select
              name='paymentMode'
              className='form-control'
              value={formData.paymentMode}
              onChange={handleInputChange}
            >
              <option value=''>-- Select Payment Mode --</option>
              <option value='Cash'>Cash</option>
              <option value='Card'>Card</option>
              <option value='UPI'>UPI</option>
              <option value='Net Banking'>Net Banking</option>
              <option value='Cheque'>Cheque</option>
            </select>
          </div>

          {/* Advance Amount */}
          {/* <div className='form-group col-md-6'>
            <label>Advance Amount</label>
            <input
              type='number'
              className='form-control'
              name='advanceAmt'
              value={formData.advanceAmt}
              onChange={handleInputChange}
            />
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default CustomerBilling;

// !------------------------
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "../../Config/axios";
// import Select from "react-select";

// const getCurrentDate = () => {
//   const today = new Date();
//   return today.toISOString().split("T")[0];
// };

// const CustomerBilling = ({ onDataChange }) => {
//   const [formData, setFormData] = useState({
//     CustomerName: "",
//     Billdate: getCurrentDate(),
//     advanceAmt: "",
//     paymentMode: "",
//     selectedBeat: null, // New state to hold the selected beat object { areaName, pinCode, salesmanId, salesmanName }
//     selectedSalesmanId: null, // Holds the salesman ID associated with the selected beat
//     selectedSalesmanName: "", // Holds the salesman name associated with the selected beat
//   });

//   const [customers, setCustomers] = useState([]); // Renamed for clarity
//   const [selectedCustomer, setSelectedCustomer] = useState(null); // Renamed for clarity
//   const [salesmen, setSalesmen] = useState([]); // All salesmen data
//   const [allBeats, setAllBeats] = useState([]); // All unique beats from all salesmen
//   const [filteredBeatsOptions, setFilteredBeatsOptions] = useState([]); // Beats to show in the dropdown

//   // Helper to flatten and unique beats with their associated salesman info
//   const processSalesmenBeats = (salesmenData) => {
//     const beatsMap = new Map(); // Using a Map to store unique beats and link them to salesman info

//     salesmenData.forEach((salesman) => {
//       // Ensure salesman.beat is an array and handle potential stringified JSON
//       let salesmanBeats = [];
//       if (Array.isArray(salesman.beat)) {
//         if (salesman.beat.length > 0 && typeof salesman.beat[0] === "string") {
//           try {
//             // Attempt to parse the stringified JSON within the array
//             const parsed = JSON.parse(salesman.beat[0]);
//             if (Array.isArray(parsed)) {
//               salesmanBeats = parsed;
//             }
//           } catch (e) {
//             console.error("Error parsing salesman beat data:", e);
//           }
//         } else {
//           salesmanBeats = salesman.beat;
//         }
//       }

//       salesmanBeats.forEach((beat) => {
//         // Create a unique key for the beat (areaName + pinCode)
//         const beatKey = `${beat.areaName}-${beat.pinCode}`;
//         if (!beatsMap.has(beatKey)) {
//           // If beat is unique, add it to the map with salesman info
//           beatsMap.set(beatKey, {
//             areaName: beat.areaName,
//             pinCode: beat.pinCode,
//             salesmanId: salesman._id,
//             salesmanName: salesman.name,
//             label: `${beat.areaName} (${beat.pinCode})`, // Label for react-select
//             value: beatKey, // Value for react-select
//           });
//         }
//       });
//     });
//     return Array.from(beatsMap.values()); // Convert Map values back to an array
//   };

//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get("/customer");
//       setCustomers(res.data);
//     } catch (err) {
//       console.error(err);
//       // alert("Failed to fetch customer");
//     }
//   };

//   const fetchSalesmen = async () => {
//     try {
//       const response = await axios.get("/salesman");
//       // Assuming your API returns an object with a 'Data' key containing the array
//       // If it returns an array directly, use response.data
//       setSalesmen(response.data.Data || response.data); // Adjust based on actual API response structure

//       // Process beats as soon as salesmen data is fetched
//       setAllBeats(processSalesmenBeats(response.data.Data || response.data));
//     } catch (error) {
//       console.error("Error fetching salesmen:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//     fetchSalesmen();
//   }, []);

//   // Effect to filter beats based on selected customer's city (optional, but logical)
//   useEffect(() => {
//     if (selectedCustomer) {
//       // Assuming customer object has a 'city' field
//       const customerCity = selectedCustomer.city
//         ? selectedCustomer.city.toLowerCase()
//         : "";
//       const beatsInCustomerCity = allBeats.filter(
//         (beat) =>
//           // You might need a way to link beat to city.
//           // For simplicity, let's assume beat.areaName contains city info or you have a city field in beat.
//           // Or, more robustly, fetch salesmen based on customer's region/city,
//           // but for this example, we'll just show all beats or filter by city if beat has it.
//           // If beat objects don't have city, you'd need to link salesmen's beats to their cities.
//           // For now, let's just show all beats if you don't have city data in beat objects.
//           true // For now, show all beats regardless of customer city
//       );
//       setFilteredBeatsOptions(beatsInCustomerCity);
//     } else {
//       setFilteredBeatsOptions(allBeats); // Show all beats if no customer is selected
//     }
//   }, [selectedCustomer, allBeats]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const updatedForm = {
//       ...formData,
//       [name]: value,
//     };
//     setFormData(updatedForm);
//     onDataChange({
//       ...updatedForm,
//       customerId: selectedCustomer?._id || null,
//       customerName: selectedCustomer?.firm || "", // Use firm for customerName
//       // Include selected beat and salesman details
//       selectedBeat: updatedForm.selectedBeat,
//       selectedSalesmanId: updatedForm.selectedSalesmanId,
//       selectedSalesmanName: updatedForm.selectedSalesmanName,
//     });
//   };

//   // Handler for Customer Select
//   const handleCustomerSelectChange = (selectedOption) => {
//     const customerObj = customers.find((c) => c._id === selectedOption.value);
//     setSelectedCustomer(customerObj);

//     const updatedForm = {
//       ...formData,
//       customerId: customerObj._id,
//       customerName: customerObj.firm,
//       selectedBeat: null, // Reset selected beat when customer changes
//       selectedSalesmanId: null, // Reset salesman when customer changes
//       selectedSalesmanName: "", // Reset salesman name
//     };
//     setFormData(updatedForm);
//     onDataChange(updatedForm);
//   };

//   // Handler for Beat Select
//   const handleBeatSelectChange = (selectedOption) => {
//     // selectedOption here is the beat object from allBeats that we created
//     const selectedBeatObject = filteredBeatsOptions.find(
//       (b) => b.value === selectedOption.value
//     );

//     const updatedForm = {
//       ...formData,
//       selectedBeat: selectedBeatObject,
//       selectedSalesmanId: selectedBeatObject
//         ? selectedBeatObject.salesmanId
//         : null,
//       selectedSalesmanName: selectedBeatObject
//         ? selectedBeatObject.salesmanName
//         : "",
//     };
//     setFormData(updatedForm);
//     onDataChange(updatedForm); // Notify parent component
//   };

//   return (
//     <div className='container mt-4'>
//       <h4 className='mb-4'>Customer Information</h4>
//       <form>
//         <div className='row'>
//           {/* Select Customer */}
//           <div className='form-group col-md-6'>
//             <label className='form-label'>
//               <strong>Select Customer</strong>
//             </label>
//             <Select
//               options={customers.map((customer) => ({
//                 label: customer.firm,
//                 value: customer._id,
//               }))}
//               value={
//                 selectedCustomer
//                   ? {
//                       label: selectedCustomer.firm,
//                       value: selectedCustomer._id,
//                     }
//                   : null
//               }
//               onChange={handleCustomerSelectChange}
//               placeholder='Select a Customer...'
//               menuPortalTarget={document.body}
//               styles={{
//                 menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//               }}
//             />
//           </div>

//           {/* Bill Date */}
//           <div className='form-group col-md-6'>
//             <label>Bill Date</label>
//             <input
//               type='date'
//               className='form-control'
//               name='Billdate'
//               value={formData.Billdate}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Payment Mode */}
//           <div className='form-group col-md-6' style={{ fontWeight: "bold" }}>
//             <label>Payment Mode</label>
//             <select
//               name='paymentMode'
//               className='form-control'
//               value={formData.paymentMode}
//               onChange={handleChange}
//             >
//               <option value=''>-- Select Payment Mode --</option>
//               <option value='Cash'>Cash</option>
//               <option value='Card'>Card</option>
//               <option value='UPI'>UPI</option>
//               <option value='Net Banking'>Net Banking</option>
//               <option value='Cheque'>Cheque</option>
//             </select>
//           </div>

//           {/* Select Beat */}
//           <div className='form-group col-md-6'>
//             <label className='form-label'>
//               <strong>Select Beat</strong>
//             </label>
//             <Select
//               options={filteredBeatsOptions} // Use filtered options here
//               value={formData.selectedBeat} // Bind to formData.selectedBeat
//               onChange={handleBeatSelectChange}
//               placeholder='Select a Beat...'
//               menuPortalTarget={document.body}
//               styles={{
//                 menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//               }}
//             />
//           </div>

//           {/* Display Salesman Name */}
//           <div className='form-group col-md-6'>
//             <label className='form-label'>
//               <strong>Salesman for Selected Beat</strong>
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               value={formData.selectedSalesmanName || "N/A"}
//               readOnly // Make this field read-only
//               disabled={!formData.selectedBeat} // Disable if no beat is selected
//             />
//           </div>

//           {/* This original Salesman dropdown is now potentially redundant if you use the beat-based selection */}
//           {/* If you still need a general salesman dropdown (not tied to beats), keep this. */}
//           {/* <div className='form-group col-md-12' style={{ fontWeight: "bold" }}>
//             <label>Salesman</label>
//             <select
//               name='salesmanId'
//               className='form-control'
//               value={formData.salesmanId || ""}
//               onChange={(e) => {
//                 const updatedForm = {
//                   ...formData,
//                   salesmanId: e.target.value,
//                 };
//                 setFormData(updatedForm);
//                 onDataChange({
//                   ...updatedForm,
//                   companyId: selectedCustomer?._id || null,
//                 });
//               }}
//             >
//               <option value=''>-- Select Salesman --</option>
//               {Array.isArray(salesmen) &&
//                 salesmen.map((salesman) => (
//                   <option key={salesman._id} value={salesman._id}>
//                     {salesman.name}
//                   </option>
//                 ))}
//             </select>
//           </div> */}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CustomerBilling;

// !------------------

// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "../../Config/axios";
// import Select from "react-select";

// const getCurrentDate = () => {
//   const today = new Date();
//   return today.toISOString().split("T")[0];
// };

// const CustomerBilling = ({ onDataChange }) => {
//   const [formData, setFormData] = useState({
//     customerId: null, // To store the _id of the selected customer
//     customerName: "", // To store the firm name of the selected customer
//     salesmanId: "", // To store the _id of the selected salesman
//     selectedBeat: "", // To store the selected beat string (e.g., "aq", "trew")

//     Billdate: getCurrentDate(),
//     advanceAmt: "", // Currently commented out in JSX, but keeping here
//     paymentMode: "",
//   });

//   const [allCustomers, setAllCustomers] = useState([]); // Renamed from 'customer' for clarity
//   const [selectedCustomer, setSelectedCustomer] = useState(null); // Holds the full customer object
//   const [salesmen, setSalesmen] = useState([]);

//   // Fetch all customers
//   const fetchAllCustomers = async () => {
//     try {
//       const res = await axios.get("/customer");
//       setAllCustomers(res.data); // Store the array of all customers
//     } catch (err) {
//       console.error(err);
//       // alert("Failed to fetch customer"); // Consider using Toastify for better UX
//     }
//   };

//   // Fetch salesmen
//   const fetchSalesmen = async () => {
//     try {
//       const response = await axios.get("/salesman");
//       setSalesmen(response.data.Data);
//     } catch (error) {
//       console.error("Error fetching salesmen:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllCustomers();
//     fetchSalesmen();
//   }, []);

//   // Effect to call onDataChange whenever formData or selectedCustomer changes
//   // This ensures the parent component always has the latest data
//   useEffect(() => {
//     onDataChange(formData);
//   }, [formData, onDataChange]); // Include onDataChange in dependency array (it should be stable)

//   // Handles changes for regular input fields (Billdate, advanceAmt, paymentMode)
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   console.log("Current formData state:", formData);
//   console.log("Current selectedCustomer state:", selectedCustomer);

//   return (
//     <div className='container mt-4'>
//       <h4 className='mb-4'>Customer Information</h4>
//       <form>
//         <div className='row'>
//           {/* Salesman Selection */}
//           <div className='form-group col-md-6' style={{ fontWeight: "bold" }}>
//             <label>Salesman</label>
//             <select
//               name='salesmanId'
//               className='form-control'
//               value={formData.salesmanId} // Controlled component
//               onChange={handleChange} // Use general handleChange
//             >
//               <option value=''>-- Select Salesman --</option>
//               {Array.isArray(salesmen) &&
//                 salesmen.map((salesman) => (
//                   <option key={salesman._id} value={salesman._id}>
//                     {salesman.name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className='d-flex '>
//             {/* Customer Selection */}
//             <div className='form-group col-md-6 me-3'>
//               <label className='form-label'>
//                 <strong>Select Customer</strong>
//               </label>
//               <Select
//                 options={allCustomers.map((cust) => ({
//                   // Map from allCustomers
//                   label: cust.firm,
//                   value: cust._id,
//                   customerObject: cust, // Store the full customer object here
//                 }))}
//                 value={
//                   selectedCustomer // Use selectedCustomer for the value
//                     ? {
//                         label: selectedCustomer.firm,
//                         value: selectedCustomer._id,
//                       }
//                     : null
//                 }
//                 onChange={(selectedOption) => {
//                   const customerObj = selectedOption.customerObject; // Get the full object
//                   setSelectedCustomer(customerObj); // Set the full customer object

//                   // Update formData with customer details and reset selected beat
//                   setFormData((prevFormData) => ({
//                     ...prevFormData,
//                     customerId: customerObj._id,
//                     customerName: customerObj.firm,
//                     selectedBeat: "", // Reset selected beat when customer changes
//                   }));
//                 }}
//                 placeholder='Select a Customer...'
//                 menuPortalTarget={document.body}
//                 styles={{
//                   menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                 }}
//               />
//             </div>

//             {/* Beat Selection - Dynamically populated based on selectedCustomer */}
//             <div className='form-group col-md-6'>
//               <label className='form-label'>
//                 <strong>Select Beat</strong>
//               </label>
//               <Select
//                 // CRITICAL CHANGE: options come from selectedCustomer.beats
//                 options={
//                   selectedCustomer?.beats?.map((beatString) => ({
//                     label: beatString, // The beat is a string, so label and value are the same
//                     value: beatString,
//                   })) || []
//                 } // Ensure it defaults to an empty array if no customer/beats
//                 value={
//                   formData.selectedBeat // Controlled component: value from formData.selectedBeat
//                     ? {
//                         label: formData.selectedBeat,
//                         value: formData.selectedBeat,
//                       }
//                     : null
//                 }
//                 onChange={(selectedOption) => {
//                   setFormData((prevFormData) => ({
//                     ...prevFormData,
//                     selectedBeat: selectedOption.value, // Store the selected beat string
//                   }));
//                 }}
//                 placeholder={
//                   selectedCustomer
//                     ? "Select a Beat..."
//                     : "Select a Customer first"
//                 }
//                 isDisabled={
//                   !selectedCustomer ||
//                   !selectedCustomer.beats ||
//                   selectedCustomer.beats.length === 0
//                 } // Disable if no customer or no beats
//                 menuPortalTarget={document.body}
//                 styles={{
//                   menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                 }}
//               />
//             </div>
//           </div>
//           {/* Bill Date */}
//           <div className='form-group col-md-6'>
//             <label>Bill Date</label>
//             <input
//               type='date'
//               className='form-control'
//               name='Billdate'
//               value={formData.Billdate}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Payment Mode */}
//           <div className='form-group col-md-6' style={{ fontWeight: "bold" }}>
//             <label>Payment Mode</label>
//             <select
//               name='paymentMode'
//               className='form-control'
//               value={formData.paymentMode}
//               onChange={handleChange}
//             >
//               <option value=''>-- Select Payment Mode --</option>
//               <option value='Cash'>Cash</option>
//               <option value='Card'>Card</option>
//               <option value='UPI'>UPI</option>
//               <option value='Net Banking'>Net Banking</option>
//               <option value='Cheque'>Cheque</option>
//             </select>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CustomerBilling;
