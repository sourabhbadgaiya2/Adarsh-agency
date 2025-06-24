// import React, { useEffect, useState, useCallback, useRef } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "../../Config/axios"; // Assuming this path is correct
// import Select from "react-select";

// // Helper function to get the current date in YYYY-MM-DD format
// const getCurrentDate = () => {
//   const today = new Date();
//   return today.toISOString().split("T")[0];
// };

// const CustomerBilling = ({
//   onNextFocus,
//   onDataChange,
//   resetTrigger = { resetKey },
// }) => {
//   const isFirstRender = useRef(true);
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

//   useEffect(() => {
//     setFormData({
//       Billdate: getCurrentDate(),
//       advanceAmt: "",
//       paymentMode: "",
//       selectedSalesmanId: null,
//       selectedBeatId: null,
//       selectedCustomerId: null,
//     });
//     setSelectedSalesman(null);
//     setSelectedBeat(null);
//     setSelectedCustomer(null);
//     setBeatsOptions([]);
//     setCustomersOptions([]);
//   }, [resetTrigger]);

//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }

//     onDataChange({
//       ...formData,
//       selectedSalesmanId: selectedSalesman?._id || null,
//       selectedBeatId: selectedBeat?._id || null,
//       selectedCustomerId: selectedCustomer?._id || null,
//       customerName: selectedCustomer?.firm || "",
//       salesmanName: selectedSalesman?.name || "",
//     });
//   }, [formData, selectedSalesman, selectedBeat, selectedCustomer]);

//   // const parseBeatData = (beatArray) => {
//   //   let parsedBeats = [];
//   //   if (Array.isArray(beatArray)) {
//   //     if (typeof beatArray[0] === "string") {
//   //       try {
//   //         const parsed = JSON.parse(beatArray[0]);
//   //         if (Array.isArray(parsed)) parsedBeats = parsed;
//   //       } catch (e) {
//   //         console.warn("Error parsing beat string:", e);
//   //       }
//   //     } else {
//   //       parsedBeats = beatArray;
//   //     }
//   //   }
//   //   return parsedBeats;
//   // };

//   const parseBeatData = (beatArray) => {
//     if (!Array.isArray(beatArray) || beatArray.length === 0) return [];

//     // Check if first element is a stringified array
//     if (typeof beatArray[0] === "string") {
//       try {
//         const parsedArray = JSON.parse(beatArray[0]); // 👈 this handles your case
//         if (Array.isArray(parsedArray)) return parsedArray;
//       } catch (err) {
//         console.warn("Error parsing beat stringified array:", err);
//       }
//     }

//     // If already in correct format (array of objects)
//     return beatArray;
//   };

//   useEffect(() => {
//     const fetchSalesmen = async () => {
//       try {
//         const response = await axios.get("/salesman");
//         const salesmenData = response.data.Data || response.data; // Handle potential 'Data' wrapper
//         setSalesmen(salesmenData);

//         // If you still need a consolidated list of all unique beats, you can keep this.
//         // For current logic, it's not strictly necessary.
//         // const uniqueBeats = new Map();
//         // salesmenData.forEach((sMan) => {
//         //   const sManBeats = parseBeatData(sMan.beat);
//         //   sManBeats.forEach((beat) => {
//         //     if (beat._id && !uniqueBeats.has(beat._id)) {
//         //       uniqueBeats.set(beat._id, {
//         //         ...beat,
//         //         salesmanId: sMan._id,
//         //         salesmanName: sMan.name,
//         //       });
//         //     }
//         //   });
//         // });
//         // setAllBeatsRaw(Array.from(uniqueBeats.values()));
//       } catch (error) {
//         console.error("Error fetching salesmen:", error);
//       }
//     };
//     fetchSalesmen();
//   }, []);

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

//   // useEffect(() => {
//   //   if (selectedSalesman) {
//   //     const salesmanBeats = parseBeatData(selectedSalesman.beat);

//   //     const options = salesmanBeats.map((beat) => ({
//   //       label: `${beat.areaName} ${beat.pinCode ? `(${beat.pinCode})` : ""}`,
//   //       value: beat._id,
//   //       beatObject: { ...beat, salesmanId: selectedSalesman._id },
//   //     }));

//   //     setBeatsOptions(options);
//   //     setSelectedBeat(null); // Reset selected beat
//   //     setSelectedCustomer(null); // Reset selected customer
//   //     setCustomersOptions([]); // Clear customer options
//   //   } else {
//   //     // If no salesman is selected, clear all dependent selections
//   //     setBeatsOptions([]);
//   //     setSelectedBeat(null);
//   //     setSelectedCustomer(null);
//   //     setCustomersOptions([]);
//   //   }

//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     selectedSalesmanId: selectedSalesman?._id || null,
//   //     selectedBeatId: null, // Reset beat and customer IDs in form data
//   //     selectedCustomerId: null,
//   //   }));
//   // }, [selectedSalesman]);

//   useEffect(() => {
//     if (selectedSalesman) {
//       console.log("Raw beats from selectedSalesman:", selectedSalesman.beat); // ✅ Log raw beat data

//       const salesmanBeats = parseBeatData(selectedSalesman.beat);
//       console.log("Parsed Beats:", salesmanBeats); // ✅ Log parsed data to verify

//       const options = salesmanBeats
//         .filter((beat) => beat && beat._id && beat.areaName) // ✅ Avoid undefined
//         .map((beat) => ({
//           label: `${beat.areaName} ${beat.pinCode ? `(${beat.pinCode})` : ""}`,
//           value: beat._id,
//           beatObject: { ...beat, salesmanId: selectedSalesman._id },
//         }));

//       setBeatsOptions(options);
//       setSelectedBeat(null); // Reset selected beat
//       setSelectedCustomer(null); // Reset selected customer
//       setCustomersOptions([]); // Clear customer options
//     } else {
//       // If no salesman is selected, clear all dependent selections
//       setBeatsOptions([]);
//       setSelectedBeat(null);
//       setSelectedCustomer(null);
//       setCustomersOptions([]);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       selectedSalesmanId: selectedSalesman?._id || null,
//       selectedBeatId: null, // Reset beat and customer IDs in form data
//       selectedCustomerId: null,
//     }));
//   }, [selectedSalesman]);

//   useEffect(() => {
//     if (selectedBeat) {
//       // Assuming customer.beats is an array of areaName strings
//       const filtered = allCustomers.filter((customer) =>
//         customer.beats?.includes(selectedBeat.areaName)
//       );

//       const options = filtered.map((customer) => ({
//         label: customer.firm,
//         value: customer._id,
//         customerObject: customer,
//       }));

//       setCustomersOptions(options);
//       setSelectedCustomer(null); // Reset selected customer
//     } else {
//       setCustomersOptions([]);
//       setSelectedCustomer(null);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       selectedBeatId: selectedBeat?._id || null,
//       selectedCustomerId: null, // Reset customer ID in form data
//     }));
//   }, [selectedBeat, allCustomers]);

//   const handleSalesmanSelectChange = (selectedOption) => {
//     setSelectedSalesman(selectedOption?.salesmanObject || null);
//   };

//   const handleBeatSelectChange = (selectedOption) => {
//     setSelectedBeat(selectedOption?.beatObject || null);
//   };

//   const handleCustomerSelectChange = (selectedOption) => {
//     const customerObj = selectedOption?.customerObject || null;
//     setSelectedCustomer(customerObj);
//     setFormData((prev) => ({
//       ...prev,
//       selectedCustomerId: customerObj?._id || null,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // compileAndSendData will be called by the useEffect watching formData
//   };

//   const [isSalesmanSelectOpen, setSalesmanSelectOpen] = useState(false);
//   const handleKeyDown = (e) => {
//     if (e.key !== "Enter") return;

//     const isReactSelectInput =
//       e.target.classList.contains("react-select__input") ||
//       e.target.closest(".react-select__input");

//     // Let react-select handle Enter for selection
//     if (isReactSelectInput) return;

//     e.preventDefault();

//     const form = e.target.form;
//     const focusable = Array.from(
//       form.querySelectorAll(
//         "input:not([readonly]):not([disabled]), select:not([disabled]), .react-select__input input"
//       )
//     );

//     const index = focusable.indexOf(e.target);
//     const next = focusable[index + 1];
//     if (next) next.focus();
//   };

//   // ----------- HANDLE SELECT + MOVE TO NEXT ----------
//   const handleSelectChangeWithJump =
//     (onChangeFunc) => (selectedOption, actionMeta) => {
//       onChangeFunc(selectedOption);

//       // Move to next field after selection
//       setTimeout(() => {
//         const form = document.querySelector("form");
//         const focusable = Array.from(
//           form.querySelectorAll(
//             "input:not([readonly]):not([disabled]), select:not([disabled]), .react-select__input input"
//           )
//         );

//         const active = document.activeElement;
//         const index = focusable.findIndex((el) => el === active);
//         focusable[index + 1]?.focus();
//       }, 100);
//     };

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
//             <Select
//               id='salesman-select'
//               onFocus={() => setSalesmanSelectOpen(true)}
//               onBlur={() => setSalesmanSelectOpen(false)}
//               menuIsOpen={isSalesmanSelectOpen}
//               options={salesmen.map((s) => ({
//                 label: s.name,
//                 value: s._id,
//                 salesmanObject: s,
//               }))}
//               value={
//                 selectedSalesman
//                   ? {
//                       label: selectedSalesman.name,
//                       value: selectedSalesman._id,
//                     }
//                   : null
//               }
//               onChange={(option) => {
//                 handleSalesmanSelectChange(option);
//                 setTimeout(() => {
//                   const next = document.querySelector("#beat-select input");
//                   if (next) next.focus();
//                 }, 50);
//               }}
//               onKeyDown={handleKeyDown}
//               placeholder='Select a Salesman...'
//               menuPortalTarget={document.body}
//               classNamePrefix='react-select'
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
//             <Select
//               id='beat-select'
//               options={beatsOptions}
//               classNamePrefix='react-select'
//               onKeyDown={handleKeyDown}
//               value={
//                 selectedBeat
//                   ? {
//                       value: selectedBeat._id,
//                       label: `${selectedBeat.areaName} ${
//                         selectedBeat.pinCode ? `(${selectedBeat.pinCode})` : ""
//                       }`,
//                     }
//                   : null
//               }
//               onChange={(option) => {
//                 handleBeatSelectChange(option);
//                 setTimeout(() => {
//                   const next = document.querySelector("#customer-select input");
//                   if (next) next.focus();
//                 }, 50);
//               }}
//               placeholder='Select a Beat...'
//               isDisabled={!selectedSalesman}
//               menuPortalTarget={document.body}
//               // styles={{
//               //   menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//               //   menu: (base) => ({ ...base, zIndex: 9999 }),
//               //   option: (base, state) => ({
//               //     ...base,
//               //     backgroundColor:
//               //       state.isSelected || state.isFocused
//               //         ? "transparent"
//               //         : base.backgroundColor,
//               //     color: "#000",
//               //     cursor: "pointer",
//               //   }),
//               //   control: (base) => ({
//               //     ...base,
//               //     boxShadow: "none",
//               //     borderColor: "#ccc",
//               //     "&:hover": {
//               //       borderColor: "#aaa",
//               //     },
//               //   }),
//               //   singleValue: (base) => ({
//               //     ...base,
//               //     backgroundColor: "transparent",
//               //     color: "#000",
//               //   }),
//               // }}

//               styles={{
//                 menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                 menu: (base) => ({ ...base, zIndex: 9999 }),
//                 option: (base, state) => ({
//                   ...base,
//                   backgroundColor: state.isFocused
//                     ? "#e6f0ff" // light blue for focused (arrow keys or mouse hover)
//                     : state.isSelected
//                     ? "#00000" // slightly darker for selected
//                     : base.backgroundColor,
//                   color: "#000",
//                   cursor: "pointer",
//                 }),
//                 control: (base, state) => ({
//                   ...base,
//                   boxShadow: state.isFocused ? "0 0 0 2px #2684FF" : "none",
//                   borderColor: state.isFocused ? "#2684FF" : "#ccc",
//                   "&:hover": {
//                     borderColor: state.isFocused ? "#2684FF" : "#aaa",
//                   },
//                 }),
//                 singleValue: (base) => ({
//                   ...base,
//                   backgroundColor: "transparent",
//                   color: "#000",
//                 }),
//               }}
//             />
//           </div>

//           {/* Customer */}
//           <div className='form-group col-md-6'>
//             <label>
//               <strong>Select Customer</strong>
//             </label>
//             <Select
//               id='customer-select'
//               options={customersOptions}
//               onKeyDown={handleKeyDown}
//               value={
//                 selectedCustomer
//                   ? customersOptions.find(
//                       (c) => c.value === selectedCustomer._id
//                     )
//                   : null
//               }
//               onChange={(option) => {
//                 handleCustomerSelectChange(option);
//                 setTimeout(() => {
//                   const next = document.querySelector("input[name='Billdate']");
//                   if (next) next.focus();
//                 }, 50);
//               }}
//               placeholder='Select a Customer...'
//               isDisabled={!selectedBeat}
//               menuPortalTarget={document.body}
//               classNamePrefix='react-select'
//               styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
//             />
//           </div>

//           {/* Bill Date */}
//           <div className='form-group col-md-6'>
//             <label>Bill Date</label>
//             <input
//               onKeyDown={handleKeyDown}
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
//               onKeyDown={handleKeyDown}
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
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CustomerBilling;

// !----------------------------

import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import axios from "../../Config/axios";
import Loader from "../../Components/Loader";

// Helper to get current date
const getCurrentDate = () => new Date().toISOString().split("T")[0];

const CustomerBilling = ({ onDataChange, resetTrigger, onNextFocus }) => {
  const isFirstRender = useRef(true);

  const [formData, setFormData] = useState({
    Billdate: getCurrentDate(),
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

  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Reset form when resetTrigger changes
  useEffect(() => {
    setFormData({
      Billdate: getCurrentDate(),
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
  }, [resetTrigger]);

  // Notify parent when data changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onDataChange({
      ...formData,
      salesmanName: selectedSalesman?.name || "",
      customerName: selectedCustomer?.ledger || "",
    });
  }, [formData, selectedSalesman, selectedCustomer]);

  // !-------------------------------
  // Fetch salesmen
  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get("/salesman")
  //     .then((res) => setSalesmen(res.data.Data || res.data))
  //     .catch((err) => console.error("Error fetching salesmen:", err))
  //     .finally(() => setLoading(false));
  // }, []);

  // // Fetch customers
  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get("/customer")
  //     .then((res) => setAllCustomers(res.data))
  //     .catch((err) => console.error("Error fetching customers:", err))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesmenRes, customersRes] = await Promise.all([
          axios.get("/salesman"),
          axios.get("/customer"),
        ]);

        setSalesmen(salesmenRes.data.Data || salesmenRes.data);
        setAllCustomers(customersRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // ✅ hide loader after both done
      }
    };

    fetchData();
  }, []);

  // !-------------------------------

  // When salesman is selected
  useEffect(() => {
    if (selectedSalesman) {
      const beats = Array.isArray(selectedSalesman.beat)
        ? selectedSalesman.beat
        : [];

      const beatOpts = beats.map((b) => ({
        label: b.area,
        value: b._id,
        beatObject: b,
      }));

      setBeatsOptions(beatOpts);
    } else {
      setBeatsOptions([]);
    }

    setSelectedBeat(null);
    setSelectedCustomer(null);
    setCustomersOptions([]);

    setFormData((prev) => ({
      ...prev,
      selectedSalesmanId: selectedSalesman?._id || null,
      selectedBeatId: null,
      selectedCustomerId: null,
    }));
  }, [selectedSalesman]);

  // When beat is selected
  useEffect(() => {
    if (selectedBeat) {
      const filtered = allCustomers.filter(
        (c) => c.area?.toLowerCase() === selectedBeat.area?.toLowerCase()
      );

      const customerOpts = filtered.map((c) => ({
        label: c.ledger,
        value: c._id,
        customerObject: c,
      }));

      setCustomersOptions(customerOpts);
    } else {
      setCustomersOptions([]);
    }

    setSelectedCustomer(null);

    setFormData((prev) => ({
      ...prev,
      selectedBeatId: selectedBeat?._id || null,
      selectedCustomerId: null,
    }));
  }, [selectedBeat, allCustomers]);

  // When customer is selected
  const handleCustomerSelectChange = (option) => {
    const customer = option?.customerObject || null;
    setSelectedCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      selectedCustomerId: customer?._id || null,
    }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enter key focus jump
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const form = e.target.form;
    const focusable = Array.from(
      form.querySelectorAll("input, select, .react-select__input input")
    ).filter((el) => !el.disabled);

    const index = focusable.indexOf(e.target);
    if (index >= 0 && focusable[index + 1]) {
      focusable[index + 1].focus();
    } else {
      // 👇 This is the fix: focus ProductBillingReport
      console.log("Reached last CustomerBilling input. Calling onNextFocus()");
      onNextFocus?.();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container mt-4'>
      <h4 className='mb-4'>Customer Billing</h4>
      <form>
        <div className='row'>
          {/* Salesman */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Salesman</strong>
            </label>
            <Select
              options={salesmen.map((s) => ({
                label: s.name,
                value: s._id,
                salesmanObject: s,
              }))}
              value={
                selectedSalesman && {
                  label: selectedSalesman.name,
                  value: selectedSalesman._id,
                }
              }
              onChange={(opt) => setSelectedSalesman(opt?.salesmanObject)}
              // onKeyDown={handleKeyDown}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Programmatically select the currently focused option
                  const menuOptions = document.querySelectorAll(
                    ".react-select__menu .react-select__option"
                  );
                  const focusedOption = Array.from(menuOptions).find((el) =>
                    el.classList.contains("react-select__option--is-focused")
                  );
                  if (focusedOption) {
                    focusedOption.click(); // 👈 simulate user click
                  }

                  setTimeout(() => {
                    handleKeyDown(e); // 👈 now call your existing logic to move to next
                  }, 0);
                }
              }}
              placeholder='Select Salesman...'
              classNamePrefix='react-select'
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* Beat */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Beat</strong>
            </label>
            <Select
              options={beatsOptions}
              value={
                selectedBeat && {
                  label: selectedBeat.area,
                  value: selectedBeat._id,
                }
              }
              onChange={(opt) => setSelectedBeat(opt?.beatObject)}
              // onKeyDown={handleKeyDown}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Programmatically select the currently focused option
                  const menuOptions = document.querySelectorAll(
                    ".react-select__menu .react-select__option"
                  );
                  const focusedOption = Array.from(menuOptions).find((el) =>
                    el.classList.contains("react-select__option--is-focused")
                  );
                  if (focusedOption) {
                    focusedOption.click(); // 👈 simulate user click
                  }

                  setTimeout(() => {
                    handleKeyDown(e); // 👈 now call your existing logic to move to next
                  }, 0);
                }
              }}
              placeholder='Select Beat...'
              isDisabled={!selectedSalesman}
              classNamePrefix='react-select'
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* Customer */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Customer</strong>
            </label>
            <Select
              options={customersOptions}
              value={
                selectedCustomer && {
                  label: selectedCustomer.ledger,
                  value: selectedCustomer._id,
                }
              }
              onChange={handleCustomerSelectChange}
              // onKeyDown={handleKeyDown}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Programmatically select the currently focused option
                  const menuOptions = document.querySelectorAll(
                    ".react-select__menu .react-select__option"
                  );
                  const focusedOption = Array.from(menuOptions).find((el) =>
                    el.classList.contains("react-select__option--is-focused")
                  );
                  if (focusedOption) {
                    focusedOption.click(); // 👈 simulate user click
                  }

                  setTimeout(() => {
                    handleKeyDown(e); // 👈 now call your existing logic to move to next
                  }, 0);
                }
              }}
              placeholder='Select Customer...'
              isDisabled={!selectedBeat}
              classNamePrefix='react-select'
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* Bill Date */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Bill Date</strong>
            </label>
            <input
              type='date'
              className='form-control'
              name='Billdate'
              value={formData.Billdate}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              required
            />
          </div>

          {/* Payment Mode */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Payment Mode</strong>
            </label>
            <select
              name='paymentMode'
              className='form-control'
              value={formData.paymentMode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              required
            >
              <option value=''>-- Select --</option>
              <option value='Cash'>Cash</option>
              <option value='Card'>Card</option>
              <option value='UPI'>UPI</option>
              <option value='Net Banking'>Net Banking</option>
              <option value='Cheque'>Cheque</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerBilling;
