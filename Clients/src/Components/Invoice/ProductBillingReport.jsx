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

  const selectRef = useRef(); // 👈 ref for Select input

  useImperativeHandle(ref, () => ({
    focusItemName: () => {
      console.log("Focusing ItemName input...");
      try {
        selectRef.current?.focus(); // ✅ Best way to focus react-select
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
      row.GST = value.gstPercent || "";
      row.Unit = value.primaryUnit || "";

      const baseRate =
        row.Unit === value.primaryUnit
          ? value.primaryPrice
          : value.secondaryPrice;
      row.Rate = (baseRate * (1 + (value.gstPercent || 0) / 100)).toFixed(2);
    }

    if (field === "Unit" && row.product) {
      const prod = row.product;
      const baseRate =
        value === prod.primaryUnit ? prod.primaryPrice : prod.secondaryPrice;
      row.Rate = (baseRate * (1 + (prod.gstPercent || 0) / 100)).toFixed(2);
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

        const baseRate =
          row.Unit === prod.primaryUnit
            ? prod.primaryPrice
            : prod.secondaryPrice;
        row.Rate = (baseRate * (1 + (prod.gstPercent || 0) / 100)).toFixed(2);
      }
    }

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
        rate: parseFloat(r.Basic), // Store base rate
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

  // const handleKeyDown = (e, rowIndex) => {
  //   if (e.altKey && e.key === "n") {
  //     e.preventDefault();
  //     if (rowIndex === rows.length - 1) {
  //       setRows([...rows, { ...defaultRow }]);
  //     }
  //   }

  //   if (e.key === "Delete" && rows.length > 1) {
  //     e.preventDefault();
  //     const updatedRows = rows.filter((_, i) => i !== rowIndex);
  //     setRows(updatedRows);

  //     const filteredBillingData = updatedRows
  //       .filter(
  //         (r) =>
  //           r.product !== null &&
  //           r.Qty !== "" &&
  //           !isNaN(parseFloat(r.Qty)) &&
  //           parseFloat(r.Qty) > 0
  //       )
  //       .map((r) => ({
  //         productId: r.product._id,
  //         itemName: r.product.productName,
  //         hsnCode: r.product.hsnCode,
  //         unit: r.Unit,
  //         qty: parseFloat(r.Qty),
  //         Free: parseFloat(r.Free) || 0,
  //         rate: parseFloat(r.Basic),
  //         sch: parseFloat(r.Sch) || 0,
  //         schAmt: parseFloat(r.SchAmt) || 0,
  //         cd: parseFloat(r.CD) || 0,
  //         cdAmt: parseFloat(r.CDAmt) || 0,
  //         total: parseFloat(r.Total) || 0,
  //         gst: parseFloat(r.GST) || 0,
  //         amount: parseFloat(r.Amount) || 0,
  //       }));

  //     const recalculatedFinalTotal = updatedRows
  //       .reduce((sum, r) => {
  //         const amt = parseFloat(r.Amount);
  //         return sum + (isNaN(amt) ? 0 : amt);
  //       }, 0)
  //       .toFixed(2);

  //     setFinalTotalAmount(recalculatedFinalTotal);
  //     onBillingDataChange(filteredBillingData, recalculatedFinalTotal);
  //   }
  // };

  // const handleKeyDown = (e, rowIndex) => {
  //   if (e.key !== "Enter") return;

  //   e.preventDefault();

  //   const focusableSelectors =
  //     "input:not([readonly]), select, .react-select__input input";
  //   const allFocusable = Array.from(
  //     document.querySelectorAll(focusableSelectors)
  //   );

  //   const currentIndex = allFocusable.indexOf(e.target);

  //   // Move to next
  //   let next = allFocusable[currentIndex + 1];

  //   // If next is react-select, open dropdown
  //   if (next) {
  //     next.focus();
  //     if (next.className.includes("react-select__input")) {
  //       next.focus(); // focus twice to ensure open
  //     }
  //   } else {
  //     // Optional: If last input, add new row or loop back
  //     // addRow(); // your function to add new row if needed
  //     allFocusable[0]?.focus(); // Loop to first
  //   }
  // };

  const handleKeyDown = (e, rowIndex) => {
    const isEnter = e.key === "Enter";
    const isAltN = e.altKey && e.key === "n";

    if (!isEnter && !isAltN && e.key !== "Delete") return;

    const focusableSelectors =
      "input:not([readonly]), select, .react-select__input input";
    const allFocusable = Array.from(
      document.querySelectorAll(focusableSelectors)
    );

    const currentIndex = allFocusable.indexOf(e.target);

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
                      <Select
                        ref={rowIndex === 0 ? selectRef : null} // ✅ Attach ref only to first row
                        className='w-100'
                        options={products.map((p) => ({
                          label: `${p.productName}`,
                          value: p._id,
                        }))}
                        value={
                          row.product
                            ? {
                                label: row.product.productName,
                                value: row.product._id,
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const selectedProduct = products.find(
                            (p) => p._id === selectedOption?.value
                          );
                          handleChange(rowIndex, "product", selectedProduct);
                        }}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          container: (base) => ({ ...base, minWidth: "200px" }),
                        }}
                      />
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

                          // Select primaryUnit on 'p'
                          if (key === "p" && row.product?.primaryUnit) {
                            e.preventDefault();
                            handleChange(
                              rowIndex,
                              "Unit",
                              row.product.primaryUnit
                            );
                          }

                          // Select secondaryUnit on 'c'
                          if (key === "c" && row.product?.secondaryUnit) {
                            e.preventDefault();
                            handleChange(
                              rowIndex,
                              "Unit",
                              row.product.secondaryUnit
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

      <ToastContainer />
    </div>
  );
};

// export default ProductBillingReport;
export default forwardRef(ProductBillingReport);
