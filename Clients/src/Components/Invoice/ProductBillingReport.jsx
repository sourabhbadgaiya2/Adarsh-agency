// !-------------------------------------------

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import axios from "../../Config/axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultRow = {
  product: null,
  Qty: "",
  Unit: "",
  Free: "",
  Basic: "", // Without GST
  Rate: "", // With GST
  Sch: "0.00",
  SchAmt: "",
  CD: "0.00",
  CDAmt: "",
  Total: "",
  GST: "",
  Amount: 0,
};

const ProductBillingReport = ({ onBillingDataChange }, ref) => {
  const [rows, setRows] = useState([{ ...defaultRow }]);
  const [products, setProducts] = useState([]);
  const [finalTotalAmount, setFinalTotalAmount] = useState("0.00");

  // !
  const [showModal, setShowModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const modalRef = useRef(null);

  const inputRef = useRef(null);

  const [filterText, setFilterText] = useState("");

  // Filtered product list based on search input
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(filterText.toLowerCase())
  );

  const selectRef = useRef();
  const rowRefs = useRef([]);
  const selectRefs = useRef({});
  const itemNameRefs = useRef({});

  const qtyRefs = useRef([]);

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showModal]);

  useEffect(() => {
    const el = rowRefs.current[focusedIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showModal]);

  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
    if (!showModal) {
      setFilterText("");
    }
  }, [showModal]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        showModal &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current.focus();
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showModal]);

  // !

  useImperativeHandle(ref, () => ({
    focusItemName: () => {
      console.log("Focusing ItemName input...");
      try {
        selectRef.current?.focus();
      } catch (err) {
        console.log("Focus failed:", err);
      }
    },
  }));

  const fields = [
    "SR",
    "ItemName",
    "Qty",
    "Unit",
    "Free",
    "Basic", // Without GST
    "Rate", // With GST
    "Sch",
    "SchAmt",
    "CD",
    "CDAmt",
    "Total", // Without GST
    "GST", // %
    "Amount", // With GST
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/product");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const recalculateRow = (row) => {
    const qty = parseFloat(row.Qty) || 0;
    const schPercent = parseFloat(row.Sch) || 0;
    const cdPercent = parseFloat(row.CD) || 0;
    const gstPercent = parseFloat(row.GST) || 0;

    const rateWithGst = parseFloat(row.Rate) || 0;
    const rateWithoutGst = rateWithGst / (1 + gstPercent / 100);
    const basicRate = rateWithoutGst.toFixed(2);

    const basicTotal = rateWithoutGst * qty;
    const schAmt = (basicTotal * schPercent) / 100;
    const cdAmt = (basicTotal * cdPercent) / 100;

    const discountedTotal = basicTotal - schAmt - cdAmt;

    const finalAmount = discountedTotal + (discountedTotal * gstPercent) / 100;

    return {
      ...row,
      Basic: basicRate,
      Total: discountedTotal.toFixed(2),
      SchAmt: schAmt.toFixed(2),
      CDAmt: cdAmt.toFixed(2),
      Amount: finalAmount.toFixed(2),
    };
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    let row = { ...updatedRows[index], [field]: value };

    if (field === "product") {
      row.product = value;
      row.GST = parseFloat(value.gstPercent) || 0;
      row.Unit = value.primaryUnit || "";

      const baseRate = parseFloat(value.salesRate) || 0;

      if (!isNaN(baseRate)) {
        row.Rate = baseRate.toFixed(2); // ✅ GST mat jodo, direct salesRate dikhana hai
      } else {
        row.Rate = "";
      }
    }

    if (field === "Unit" && row.product) {
      const prod = row.product;
      const baseRate = parseFloat(prod.salesRate) || 0;

      if (!isNaN(baseRate)) {
        row.Rate = baseRate.toFixed(2); // ✅ Unit change pe bhi GST mat jodo
      } else {
        row.Rate = "";
      }
    }

    if (field === "Qty" && row.product) {
      const qtyNum = parseFloat(value);
      const prod = row.product;

      if (!isNaN(qtyNum) && qtyNum > 0) {
        if (qtyNum > prod.availableQty) {
          toast.error(
            `Product "${prod.productName}" has only ${prod.availableQty} in stock.`,
            { position: "top-center", autoClose: 3000 }
          );
          return;
        }

        const baseRate = parseFloat(prod.salesRate) || 0;

        if (!isNaN(baseRate)) {
          row.Rate = baseRate.toFixed(2); // ✅ Qty change pe bhi original salesRate hi dikhana hai
        } else {
          row.Rate = "";
        }
      }
    }

    // 🔁 Recalculate all row values like Basic, SchAmt, CDAmt, etc.
    row = recalculateRow(row);
    updatedRows[index] = row;
    setRows(updatedRows);

    const finalTotal = updatedRows
      .reduce((sum, r) => {
        const amt = parseFloat(r.Amount);
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0)
      .toFixed(2);

    setFinalTotalAmount(finalTotal);

    const filteredBillingData = updatedRows
      .filter(
        (r) =>
          r.product !== null &&
          r.Qty !== "" &&
          !isNaN(parseFloat(r.Qty)) &&
          parseFloat(r.Qty) > 0
      )
      .map((r) => ({
        productId: r.product._id,
        itemName: r.product.productName,
        hsnCode: r.product.hsnCode,
        unit: r.Unit,
        qty: parseFloat(r.Qty),
        Free: parseFloat(r.Free) || 0,
        rate: parseFloat(r.Basic), // Basic rate without GST
        sch: parseFloat(r.Sch) || 0,
        schAmt: parseFloat(r.SchAmt) || 0,
        cd: parseFloat(r.CD) || 0,
        cdAmt: parseFloat(r.CDAmt) || 0,
        total: parseFloat(r.Total) || 0,
        gst: parseFloat(r.GST) || 0,
        amount: parseFloat(r.Amount) || 0,
      }));

    onBillingDataChange(filteredBillingData, finalTotal);
  };

  const getInputMatrix = () => {
    const focusableSelector =
      "input:not([readonly]), select, .react-select__input input";
    const focusables = Array.from(document.querySelectorAll(focusableSelector));

    const rows = document.querySelectorAll("tbody tr");
    const matrix = [];

    rows.forEach((tr) => {
      const rowInputs = Array.from(tr.querySelectorAll(focusableSelector));
      if (rowInputs.length) {
        matrix.push(rowInputs);
      }
    });

    return matrix;
  };

  const handleKeyDown = (e, rowIndex) => {
    const isEnter = e.key === "Enter";
    const isAltN = e.altKey && e.key === "n";
    const isEscape = e.key === "Escape";

    const focusableSelectors =
      "input:not([readonly]), select, .react-select__input input";
    const allFocusable = Array.from(
      document.querySelectorAll(focusableSelectors)
    );

    const currentIndex = allFocusable.indexOf(e.target);

    // LEFT ←
    if (e.key === "ArrowLeft") {
      const cursorAtStart =
        e.target.selectionStart === 0 && e.target.selectionEnd === 0;
      if (cursorAtStart) {
        e.preventDefault();
        const prev = allFocusable[currentIndex - 1];
        if (prev) prev.focus();
      }
      return;
    }

    // RIGHT →
    if (e.key === "ArrowRight") {
      const cursorAtEnd = e.target.selectionStart === e.target.value?.length;
      if (cursorAtEnd) {
        e.preventDefault();
        const next = allFocusable[currentIndex + 1];
        if (next) next.focus();
      }
      return;
    }

    // ===== UP / DOWN Arrow movement between rows =====
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const inputMatrix = getInputMatrix();

      let targetRow = -1;
      let targetCol = -1;

      for (let row = 0; row < inputMatrix.length; row++) {
        for (let col = 0; col < inputMatrix[row].length; col++) {
          if (inputMatrix[row][col] === e.target) {
            targetRow = row;
            targetCol = col;
            break;
          }
        }
        if (targetRow !== -1) break;
      }

      if (targetRow !== -1) {
        e.preventDefault();
        const nextRow = e.key === "ArrowUp" ? targetRow - 1 : targetRow + 1;

        if (inputMatrix[nextRow] && inputMatrix[nextRow][targetCol]) {
          inputMatrix[nextRow][targetCol].focus();
        }
      }

      return;
    }

    // if (isEscape) {
    //   e.preventDefault();

    //   const prev = allFocusable[currentIndex - 1];
    //   if (prev) {
    //     prev.focus();
    //   } else {
    //     if (selectRef.current) {
    //       selectRef.current.focus();
    //     } else {
    //       console.log("Select ref not ready");
    //     }
    //   }
    //   return;
    // }

    if (isEscape) {
      e.preventDefault();

      // Try going to previous input
      const prev = allFocusable[currentIndex - 1];

      if (prev) {
        prev.focus();
      } else {
        // Now manually focus React Select input

        const selectInstance = selectRefs.current[rowIndex];
        const reactSelectInput = selectInstance?.select?.inputRef;

        if (reactSelectInput) {
          reactSelectInput.focus();
        } else {
          console.warn("❌ React-Select inputRef not found");
        }
      }

      return;
    }

    // ===== Alt + N or Enter on last input: Add new row =====
    if ((isAltN || isEnter) && rowIndex === rows.length - 1) {
      const isLastInput = currentIndex === allFocusable.length - 1;

      if (isAltN || isLastInput) {
        e.preventDefault();
        const newRows = [...rows, { ...defaultRow }];
        setRows(newRows);

        // Focus first input of new row after DOM update
        setTimeout(() => {
          const updatedFocusable = Array.from(
            document.querySelectorAll(focusableSelectors)
          );
          updatedFocusable[allFocusable.length]?.focus(); // first input of new row
        }, 50);
        return;
      }
    }

    // ===== Enter: Normal move to next input =====
    if (isEnter) {
      e.preventDefault();
      const next = allFocusable[currentIndex + 1];
      if (next) {
        next.focus();
      } else {
        allFocusable[0]?.focus(); // fallback
      }
      return;
    }

    // ===== Delete row shortcut =====
    if (e.key === "Delete" && rows.length > 1) {
      e.preventDefault();
      const updatedRows = rows.filter((_, i) => i !== rowIndex);
      setRows(updatedRows);

      const filteredBillingData = updatedRows
        .filter(
          (r) =>
            r.product !== null &&
            r.Qty !== "" &&
            !isNaN(parseFloat(r.Qty)) &&
            parseFloat(r.Qty) > 0
        )
        .map((r) => ({
          productId: r.product._id,
          itemName: r.product.productName,
          hsnCode: r.product.hsnCode,
          unit: r.Unit,
          qty: parseFloat(r.Qty),
          Free: parseFloat(r.Free) || 0,
          rate: parseFloat(r.Basic),
          sch: parseFloat(r.Sch) || 0,
          schAmt: parseFloat(r.SchAmt) || 0,
          cd: parseFloat(r.CD) || 0,
          cdAmt: parseFloat(r.CDAmt) || 0,
          total: parseFloat(r.Total) || 0,
          gst: parseFloat(r.GST) || 0,
          amount: parseFloat(r.Amount) || 0,
        }));

      const recalculatedFinalTotal = updatedRows
        .reduce((sum, r) => {
          const amt = parseFloat(r.Amount);
          return sum + (isNaN(amt) ? 0 : amt);
        }, 0)
        .toFixed(2);

      setFinalTotalAmount(recalculatedFinalTotal);
      onBillingDataChange(filteredBillingData, recalculatedFinalTotal);
    }
  };

  return (
    <div
      className='mt-4'
      style={{
        width: "100vw",
        padding: "0 1rem",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <h2 className='text-center mb-4'>Product Invoice</h2>

      <div className='mt-3 p-3 bg-light border rounded'>
        <h5>Total Items: {rows.length}</h5>
        <div className='d-flex align-items-center gap-4 text-muted mb-0'>
          <strong>Shortcuts:</strong>
          <div className='d-flex align-items-center gap-3'>
            <span>
              <strong>New Line:</strong> Enter
            </span>
            <span>
              <strong>Save Row:</strong> Enter
            </span>
            <span>
              <strong>Delete Row:</strong> Delete
            </span>
          </div>
        </div>
      </div>

      <div
        className='table-responsive'
        style={{ maxHeight: "70vh", overflowX: "auto", overflowY: "auto" }}
      >
        <table
          className='table table-bordered text-center'
          style={{
            border: "2px solid #dee2e6",
            borderRadius: "8px",
            minWidth: "1200px",
          }}
        >
          <thead className='table-secondary'>
            <tr>
              {fields.map((field, idx) => (
                <th key={idx}>
                  {field === "Sch" ? "Sch%" : field === "CD" ? "CD%" : field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} onKeyDown={(e) => handleKeyDown(e, rowIndex)}>
                {fields.map((field, colIndex) => (
                  <td key={colIndex} style={{ minWidth: "150px" }}>
                    {field === "SR" ? (
                      rowIndex + 1
                    ) : field === "ItemName" ? (
                      <div
                        tabIndex={0}
                        onFocus={() => {
                          setSelectedRowIndex(rowIndex);
                          setShowModal(true);
                        }}
                      >
                        <Select
                          // ref={rowIndex === 0 ? selectRef : null}
                          ref={(ref) => {
                            if (ref) {
                              selectRefs.current[rowIndex] = ref; // ✅ save Select instance
                              if (rowIndex === 0) selectRef.current = ref; // optional
                            }
                          }}
                          className='w-100'
                          // isDisabled

                          value={
                            row.product
                              ? {
                                  label: row.product.productName,
                                  value: row.product._id,
                                }
                              : null
                          }
                          placeholder='Select Product'
                          styles={{
                            container: (base) => ({
                              ...base,
                              minWidth: "200px",
                            }),
                          }}
                        />
                      </div>
                    ) : field === "Unit" ? (
                      <Select
                        className='w-100'
                        value={
                          row.Unit ? { label: row.Unit, value: row.Unit } : null
                        }
                        options={[
                          row.product?.primaryUnit && {
                            label: row.product.primaryUnit,
                            value: row.product.primaryUnit,
                          },
                          row.product?.secondaryUnit && {
                            label: row.product.secondaryUnit,
                            value: row.product.secondaryUnit,
                          },
                        ].filter(Boolean)}
                        onChange={(selectedOption) => {
                          handleChange(rowIndex, "Unit", selectedOption.value);
                        }}
                        onKeyDown={(e) => {
                          const key = e.key.toLowerCase();
                          //!
                          // Select secondaryUnit on 'p'
                          if (key === "p" && row.product?.secondaryUnit) {
                            e.preventDefault();
                            handleChange(
                              rowIndex,
                              "Unit",
                              row.product.secondaryUnit
                            );
                          }

                          // Select primaryUnit  on 'c'
                          if (key === "c" && row.product?.primaryUnit) {
                            e.preventDefault();
                            handleChange(
                              rowIndex,
                              "Unit",
                              row.product.primaryUnit
                            );
                          }
                        }}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    ) : [
                        "SchAmt",
                        "CDAmt",
                        "Total",
                        "Amount",
                        "Basic",
                      ].includes(field) ? (
                      <input
                        type='number'
                        className='form-control'
                        value={row[field]}
                        readOnly
                      />
                    ) : field === "GST" ? (
                      <input
                        type='text'
                        className='form-control'
                        value={row[field]}
                        readOnly
                      />
                    ) : (
                      <input
                        type='text'
                        className='form-control'
                        ref={(el) => {
                          if (field === "Qty") qtyRefs.current[rowIndex] = el;
                        }}
                        value={row[field] || ""}
                        onChange={(e) =>
                          handleChange(rowIndex, field, e.target.value)
                        }
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}

            <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
              <td colSpan={fields.length - 1} className='text-start'>
                Final Amount: ₹ <span>{finalTotalAmount}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*//! select option model item name model */}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff",
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
                  prev < filteredProducts.length - 1 ? prev + 1 : 0
                );
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredProducts.length - 1
                );
              }
              if (e.key === "Enter" && focusedIndex !== -1) {
                const selectedProduct = filteredProducts[focusedIndex];
                handleChange(selectedRowIndex, "product", selectedProduct);
                setShowModal(false);

                setTimeout(() => {
                  qtyRefs.current[selectedRowIndex]?.focus();
                }, 100);
              }
            }}
            tabIndex={-1}
            ref={modalRef}
          >
            <h5>Select a Product</h5>

            <input
              type='text'
              className='form-control mb-3'
              placeholder='Search products...'
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setFocusedIndex(0);
              }}
              ref={inputRef}
              autoFocus
            />

            <table className='table table-bordered table-hover'>
              <thead className='table-light'>
                <tr>
                  <th>Product Name</th>
                  <th>HSN Code</th>
                  <th>Stock</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    ref={(el) => (rowRefs.current[index] = el)}
                    className={index === focusedIndex ? "table-active" : ""}
                  >
                    <td>{product.productName}</td>
                    <td>{product.hsnCode}</td>
                    <td>{product.availableQty}</td>
                    <td>{product.salesRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default forwardRef(ProductBillingReport);
