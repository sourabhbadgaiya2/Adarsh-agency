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
  const isFirstRender = useRef(true);
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

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();

  //     const form = e.target.form;

  //     // Get all focusable elements in order
  //     const focusable = Array.from(
  //       form.querySelectorAll(
  //         "input:not([readonly]):not([disabled]), select:not([disabled]), .react-select__input input"
  //       )
  //     );

  //     const index = focusable.indexOf(e.target);

  //     const next = focusable[index + 1];

  //     if (next) {
  //       next.focus();

  //       // For react-select, call focus again to ensure dropdown works
  //       if (next.className.includes("react-select__input")) {
  //         setTimeout(() => next.focus(), 10);
  //       }
  //     } else {
  //       // Optional: loop to first field
  //       focusable[0]?.focus();
  //     }
  //   }
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key !== "Enter") return;

  //   e.preventDefault();

  //   const form = e.target.form;

  //   const focusable = Array.from(
  //     form.querySelectorAll(
  //       "input:not([readonly]):not([disabled]), select:not([disabled]), .react-select__input input"
  //     )
  //   );

  //   const index = focusable.indexOf(e.target);

  //   const isReactSelect = e.target.className.includes("react-select__input");

  //   if (isReactSelect) {
  //     // If react-select and menu is already open, press Enter = select + move on
  //     const next = focusable[index + 1];
  //     setTimeout(() => {
  //       next?.focus();
  //     }, 100);
  //   } else {
  //     // Standard inputs or selects
  //     const next = focusable[index + 1];
  //     if (next) next.focus();
  //   }
  // };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const form = e.target.form;

    const focusable = Array.from(
      form.querySelectorAll(
        "input:not([readonly]):not([disabled]), select:not([disabled]), .react-select__input input"
      )
    );

    const index = focusable.indexOf(e.target);

    const next = focusable[index + 1];
    if (next) next.focus();
  };

  // ----------- HANDLE SELECT + MOVE TO NEXT ----------
  const handleSelectChangeWithJump =
    (onChangeFunc) => (selectedOption, actionMeta) => {
      onChangeFunc(selectedOption);

      // Move to next field after selection
      setTimeout(() => {
        const form = document.querySelector("form");
        const focusable = Array.from(
          form.querySelectorAll(
            "input:not([readonly]):not([disabled]), select:not([disabled]), .react-select__input input"
          )
        );

        const active = document.activeElement;
        const index = focusable.findIndex((el) => el === active);
        focusable[index + 1]?.focus();
      }, 100);
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
              onKeyDown={handleKeyDown}
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
          {/* <div className='form-group col-md-6'>
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
          </div> */}
          {/* Beat */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Select Beat</strong>
            </label>
            {/* <Select
              options={beatsOptions}
              value={
                selectedBeat
                  ? {
                      value: selectedBeat._id,
                      label: `${selectedBeat.areaName} ${
                        selectedBeat.pinCode ? `(${selectedBeat.pinCode})` : ""
                      }`,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setSelectedBeat(selectedOption?.beatObject || null);
              }}
              placeholder='Select a Beat...'
              isDisabled={!selectedSalesman}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            /> */}

            <Select
              options={beatsOptions}
              classNamePrefix='react-select'
              onKeyDown={handleKeyDown}
              value={
                selectedBeat
                  ? {
                      value: selectedBeat._id,
                      label: `${selectedBeat.areaName} ${
                        selectedBeat.pinCode ? `(${selectedBeat.pinCode})` : ""
                      }`,
                    }
                  : null
              }
              onChange={handleBeatSelectChange}
              placeholder='Select a Beat...'
              isDisabled={!selectedSalesman}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),

                // ✅ Remove blue background on selected and focused options
                option: (base, state) => ({
                  ...base,
                  backgroundColor:
                    state.isSelected || state.isFocused
                      ? "transparent"
                      : base.backgroundColor,
                  color: "#000", // you can change text color if needed
                  cursor: "pointer",
                }),

                // ✅ Remove blue highlight in the control (selected option box)
                control: (base) => ({
                  ...base,
                  boxShadow: "none",
                  borderColor: "#ccc", // or any color you prefer
                  "&:hover": {
                    borderColor: "#aaa",
                  },
                }),

                // ✅ Remove blue background in the singleValue (selected item inside box)
                singleValue: (base) => ({
                  ...base,
                  backgroundColor: "transparent",
                  color: "#000",
                }),
              }}
            />
          </div>

          {/* Customer */}
          <div className='form-group col-md-6'>
            <label>
              <strong>Select Customer</strong>
            </label>
            <Select
              options={customersOptions}
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
