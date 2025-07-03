// !----------------------------

import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import axios from "../../Config/axios";
import Loader from "../../Components/Loader";

import useSearchableModal from "../../Components/SearchableModal";

const getCurrentDate = () => new Date().toISOString().split("T")[0];

const CustomerBilling = ({ onDataChange, resetTrigger, onNextFocus }) => {
  const isFirstRender = useRef(true);

  const [formData, setFormData] = useState({
    Billdate: getCurrentDate(),
    paymentMode: "",
    billingType: "",
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

  const billDateRef = useRef(null);
  const beatSelectRef = useRef(null);

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

  const handleKeyDown = (e) => {
    const form = e.target.form;
    const focusable = Array.from(
      form.querySelectorAll("input, select, .react-select__input input")
    ).filter((el) => !el.disabled);

    const index = focusable.indexOf(e.target);

    // 🔁 Go forward on Enter
    if (e.key === "Enter") {
      e.preventDefault();
      if (index >= 0 && focusable[index + 1]) {
        focusable[index + 1].focus();
      } else {
        console.log(
          "Reached last CustomerBilling input. Calling onNextFocus()"
        );
        onNextFocus?.();
      }
    }

    // 🔁 Go backward on Escape
    if (e.key === "Escape") {
      e.preventDefault();
      if (index > 0 && focusable[index - 1]) {
        focusable[index - 1].focus();
      }
    }
  };

  // ! model

  const {
    showModal,
    setShowModal,
    filterText,
    setFilterText,
    focusedIndex,
    setFocusedIndex,
    modalRef,
    inputRef,
    rowRefs,
    filteredItems: filteredCustomers,
  } = useSearchableModal(
    customersOptions.map((opt) => opt.customerObject),
    "ledger"
  );

  const {
    showModal: showSalesmanModal,
    setShowModal: setShowSalesmanModal,
    filterText: salesmanFilterText,
    setFilterText: setSalesmanFilterText,
    focusedIndex: salesmanFocusedIndex,
    setFocusedIndex: setSalesmanFocusedIndex,
    modalRef: salesmanModalRef,
    inputRef: salesmanInputRef,
    rowRefs: salesmanRowRefs,
    filteredItems: filteredSalesmen,
  } = useSearchableModal(salesmen, "name");

  const handleReactSelectKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const menuOptions = document.querySelectorAll(
        ".react-select__menu .react-select__option"
      );
      const focusedOption = Array.from(menuOptions).find((el) =>
        el.classList.contains("react-select__option--is-focused")
      );
      if (focusedOption) focusedOption.click();

      setTimeout(() => handleKeyDown(e), 0);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleKeyDown(e);
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

            <div tabIndex={0} onFocus={() => setShowSalesmanModal(true)}>
              <Select
                value={
                  selectedSalesman && {
                    label: selectedSalesman.name,
                    value: selectedSalesman._id,
                  }
                }
                placeholder='Select Salesman...'
                isDisabled={false}
                classNamePrefix='react-select'
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                onKeyDown={handleReactSelectKeyDown}
              />
            </div>
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
              ref={beatSelectRef}
              onKeyDown={handleReactSelectKeyDown}
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
            <div
              tabIndex={0}
              onFocus={() => {
                setShowModal(true);
              }}
            >
              <Select
                value={
                  selectedCustomer && {
                    label: selectedCustomer.ledger,
                    value: selectedCustomer._id,
                  }
                }
                placeholder='Select Customer...'
                isDisabled={!selectedBeat}
                classNamePrefix='react-select'
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                onKeyDown={handleReactSelectKeyDown} // ✅ Added
              />
            </div>
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
              ref={billDateRef}
            />
          </div>

          {/* Credit / Cash Selection */}
          {/* <div className='form-group col-md-6'>
            <label>
              <strong>Billing Type</strong>
            </label>
            <select
              name='billingType'
              className='form-control'
              value={formData.billingType || ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              required
            >
              <option value=''>-- Select --</option>
              <option value='Credit'>Credit</option>
              <option value='Cash'>Cash</option>
            </select>
          </div> */}

          {/* Payment Mode */}
          {/* <div className='form-group col-md-6'>
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
          </div> */}

          <div className='form-group col-md-6'>
            <label>
              <strong>Billing Type</strong>
            </label>
            <select
              name='billingType'
              className='form-control'
              value={formData.billingType || ""}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange(e);

                // Set default payment mode to 'Cash' if billingType is 'Cash'
                if (value === "Cash") {
                  handleInputChange({
                    target: { name: "paymentMode", value: "Cash" },
                  });
                } else {
                  handleInputChange({
                    target: { name: "paymentMode", value: "" },
                  }); // Clear if not cash
                }
              }}
              onKeyDown={handleKeyDown}
              required
            >
              <option value=''>-- Select --</option>
              <option value='Credit'>Credit</option>
              <option value='Cash'>Cash</option>
            </select>
          </div>

          {formData.billingType === "Cash" && (
            <div className='form-group col-md-6'>
              <label>
                <strong>Payment Mode</strong>
              </label>
              <select
                name='paymentMode'
                className='form-control'
                value={formData.paymentMode || "Cash"}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                required
              >
                <option value='Cash'>Cash</option>
                <option value='Card'>Card</option>
                <option value='UPI'>UPI</option>
                <option value='Net Banking'>Net Banking</option>
                <option value='Cheque'>Cheque</option>
              </select>
            </div>
          )}

          {/* Credit */}
        </div>
      </form>
      {/* //! customer */}
      {showModal && (
        <div
          className='modal-backdrop'
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              outline: "none",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIndex((prev) =>
                  prev < filteredCustomers.length - 1 ? prev + 1 : 0
                );
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredCustomers.length - 1
                );
              }
              if (e.key === "Enter" && filteredCustomers[focusedIndex]) {
                const selected = filteredCustomers[focusedIndex];
                setSelectedCustomer(selected);
                setFormData((prev) => ({
                  ...prev,
                  selectedCustomerId: selected._id,
                }));
                setShowModal(false);

                // 👇 Focus next field after a slight delay
                setTimeout(() => {
                  billDateRef.current?.focus();
                }, 100);
              }
            }}
            tabIndex={-1}
            ref={modalRef}
          >
            <h5>Select Customer</h5>
            <input
              ref={inputRef}
              type='text'
              className='form-control mb-3'
              placeholder='Search by customer name...'
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setFocusedIndex(0);
              }}
              autoFocus
            />

            <table className='table table-hover table-bordered'>
              <thead className='table-light'>
                <tr>
                  <th>Name</th>
                  <th>Area</th>
                  <th>Phone</th>
                  <th>Balance</th>
                  <th>GST No.</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c, index) => (
                  <tr
                    key={c._id}
                    ref={(el) => (rowRefs.current[index] = el)}
                    className={index === focusedIndex ? "table-active" : ""}
                  >
                    <td style={{ textAlign: "left" }}>{c.ledger}</td>
                    <td>{c.area}</td>
                    <td>{c.mobile}</td>
                    <td>{c.balance}</td>
                    <td>{c.gstNumber}</td>
                    <td style={{ textAlign: "left" }}>{c.address1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* //! salesman */}
      {showSalesmanModal && (
        <div
          className='modal-backdrop'
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowSalesmanModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              outline: "none",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSalesmanFocusedIndex((prev) =>
                  prev < filteredSalesmen.length - 1 ? prev + 1 : 0
                );
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSalesmanFocusedIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredSalesmen.length - 1
                );
              }
              if (e.key === "Enter" && filteredSalesmen[salesmanFocusedIndex]) {
                const selected = filteredSalesmen[salesmanFocusedIndex];
                setSelectedSalesman(selected);
                setFormData((prev) => ({
                  ...prev,
                  selectedSalesmanId: selected._id,
                }));
                setShowSalesmanModal(false);

                setTimeout(() => {
                  beatSelectRef.current?.focus(); // 👈 next focus
                }, 100);
              }
            }}
            tabIndex={-1}
            ref={salesmanModalRef}
          >
            <h5>Select Salesman</h5>
            <input
              ref={salesmanInputRef}
              type='text'
              className='form-control mb-3'
              placeholder='Search by salesman name...'
              value={salesmanFilterText}
              onChange={(e) => {
                setSalesmanFilterText(e.target.value);
                setSalesmanFocusedIndex(0);
              }}
              autoFocus
            />

            <table className='table table-hover table-bordered'>
              <thead className='table-light'>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Alternate Mobile</th>
                  <th>Beat</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesmen.map(
                  (s, index) => (
                    console.log(filteredSalesmen, "FILTERED"),
                    (
                      <tr
                        key={s._id}
                        ref={(el) => (salesmanRowRefs.current[index] = el)}
                        className={
                          index === salesmanFocusedIndex ? "table-active" : ""
                        }
                      >
                        <td>{s.name}</td>
                        <td>{s.mobile}</td>
                        <td>{s.alternateMobile}</td>
                        <td>{s.beat.map((b) => b.area).join(", ")}</td>
                        <td>{s.address}</td>
                        <td>{s.city}</td>
                        <td>{s.username}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBilling;
