import React, { useEffect, useState } from "react";
import axios from "../../Config/axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const defaultRow = {
  product: null,
  Qty: "",
  Unit: "",
  Free: "",
  Basic: "",
  Rate: "",
  Sch: "",
  SchAmt: "",
  CD: "",
  CDAmt: "",
  Total: "",
  GST: "",
  Amount: 0,
};

const ProductBillingReport = ({ onBillingDataChange }) => {
  const [rows, setRows] = useState([{ ...defaultRow }]);
  const [products, setProducts] = useState([]);
  const [finalTotalAmount, setFinalTotalAmount] = useState("0.00");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/product");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fields = [
    "ItemName",
    "Qty",
    "Unit",
    "Free",
    "Basic",
    "Rate",
    "Sch",
    "SchAmt",
    "CD",
    // "CDAmt",
    "Total",
    "GST",
    "Amount",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate amount including GST
  // const calculateAmountWithGST = (total, qty, gstPercent) => {
  //   const t = parseFloat(total);
  //   const q = parseFloat(qty);
  //   const gst = parseFloat(gstPercent);

  //   if (isNaN(t) || isNaN(q)) return 0;
  //   if (isNaN(gst) || gst <= 0) return t * q;

  //   // Correct GST calculation: total + (gst% of total)
  //   const gstAmount = t + gst / 100;
  //   return gstAmount * q;
  // };
  // const calculateAmountWithGST = (total, qty, gstPercent) => {
  //   const t = parseFloat(total);
  //   const q = parseFloat(qty);
  //   const gst = parseFloat(gstPercent);

  //   if (isNaN(t) || isNaN(q)) return 0;
  //   const subtotal = t;
  //   const gstAmount = subtotal * (gst / 100);
  //   return subtotal + gstAmount;
  // };

  // Recalculate derived fields for a row
  // const recalculateRow = (row) => {
  //   const rate = parseFloat(row.Rate) || 0;
  //   const schPercent = parseFloat(row.Sch) || 0;
  //   const cdPercent = parseFloat(row.CD) || 0;
  //   const qty = parseFloat(row.Qty) || 0;
  //   const gstPercent = parseFloat(row.GST) || 0;

  //   const schAmt = (rate * schPercent) / 100;
  //   const cdAmt = (rate * cdPercent) / 100;

  //   // Your requested formula:
  //   const total = rate - schAmt - cdAmt;

  //   const amount = calculateAmountWithGST(total, qty, gstPercent);

  //   return {
  //     ...row,
  //     SchAmt: schAmt.toFixed(2),
  //     CDAmt: cdAmt.toFixed(2),
  //     Total: total.toFixed(2),
  //     Amount: amount.toFixed(2),
  //   };
  // };
  // const recalculateRow = (row) => {
  //   let rate = parseFloat(row.Rate) || 0;
  //   const schPercent = parseFloat(row.Sch) || 0;
  //   const cdPercent = parseFloat(row.CD) || 0;
  //   const qty = parseFloat(row.Qty) || 0;
  //   const gstPercent = parseFloat(row.GST) || 0;
  //   const total = qty * rate;

  //   // Overwrite rate to match total (as per your new logic)
  //   rate = total;

  //   const schAmt = (total * schPercent) / 100;
  //   const cdAmt = (total * cdPercent) / 100;
  //   // const updateRate = qty * rate; // Use qty to calculate the total rate

  //   // const total = updateRate - schAmt - cdAmt;
  //   const amount = calculateAmountWithGST(total, qty, gstPercent);

  //   return {
  //     ...row,
  //     SchAmt: schAmt.toFixed(2),
  //     CDAmt: cdAmt.toFixed(2),
  //     Total: total.toFixed(2),

  //     Amount: amount.toFixed(2),
  //   };
  // };

  const calculateAmountWithGST = (amount, gstPercent) => {
    const gstAmount = (amount * gstPercent) / 100;
    return amount + gstAmount;
  };

  const recalculateRow = (row) => {
    const rate = parseFloat(row.Rate) || 0;
    const qty = parseFloat(row.Qty) || 0;
    const schPercent = parseFloat(row.Sch) || 0;
    const cdPercent = parseFloat(row.CD) || 0;
    const gstPercent = parseFloat(row.GST) || 0;

    const total = rate * qty;
    const schAmt = (total * schPercent) / 100;
    const cdAmt = (total * cdPercent) / 100;
    const discountedTotal = total - schAmt - cdAmt;

    const finalAmount = calculateAmountWithGST(discountedTotal, gstPercent);

    return {
      ...row,
      Total: discountedTotal.toFixed(2),
      SchAmt: schAmt.toFixed(2),
      CDAmt: cdAmt.toFixed(2),
      Amount: finalAmount.toFixed(2),
    };
  };

  // const handleChange = (index, field, value) => {
  //   const updatedRows = [...rows];
  //   let row = { ...updatedRows[index], [field]: value };

  //   // if (field === "product") {
  //   //   row.product = value;
  //   //   row.GST = value.gstPercent || "";
  //   //   // row.Unit = value.unit || "";
  //   //   row.Rate = value.salesRate || ""; // ✅ Always set salesRate
  //   //   row.Unit = value.primaryUnit || "";
  //   //   // row.Rate = value.primaryPrice || "";
  //   // }

  //   if (field === "product") {
  //     row.product = value;
  //     row.GST = value.gstPercent || "";
  //     row.Unit = value.primaryUnit || "";
  //     row.Rate = value.primaryPrice || "";
  //   }

  //   if (field === "Unit" && row.product) {
  //     const prod = row.product;
  //     if (value === prod.primaryUnit) {
  //       row.Rate = prod.primaryPrice;
  //     } else if (value === prod.secondaryUnit) {
  //       row.Rate = prod.secondaryPrice;
  //     }
  //   }

  //   // if (field === "Unit" && row.product) {
  //   //   const prod = row.product;
  //   //   if (value === prod.unit) {
  //   //     row.Rate = prod.mrp;
  //   //   }
  //   // if (value === prod.unit) {
  //   //   row.Rate = prod.mrp;
  //   // }
  //   // else if (value === prod.secondaryUnit) {
  //   //   row.Rate = prod.secondaryPrice;
  //   // }
  //   // }

  //   // if (field === "Qty" && row.product) {
  //   //   const qtyNum = parseFloat(value);
  //   //   const prod = row.product;
  //   //   if (!isNaN(qtyNum) && qtyNum > 0) {
  //   //     if (!isNaN(qtyNum) && qtyNum > 0) {
  //   //       row.Rate = prod.mrp; // Always use mrp as rate
  //   //     }
  //   //     // if (row.Unit === prod.primaryUnit) {
  //   //     //   row.Rate = prod.primaryPrice;
  //   //     // } else if (row.Unit === prod.secondaryUnit) {
  //   //     //   row.Rate = prod.secondaryPrice;
  //   //     // }
  //   //   }
  //   // }

  //   if (field === "Qty" && row.product) {
  //     const qtyNum = parseFloat(value);
  //     const prod = row.product;
  //     if (!isNaN(qtyNum) && qtyNum > 0) {
  //       if (qtyNum > prod.availableQty) {
  //         toast.error(
  //           `Product "${prod.productName}" has only ${prod.availableQty} ${prod.unit} in stock.`,
  //           { position: "top-center", autoClose: 3000 }
  //         );
  //         return; // Stop processing
  //       }
  //       row.Rate = prod.salesRate; // Always use salesRate
  //     }
  //   }

  //   row = recalculateRow(row);

  //   updatedRows[index] = row;
  //   setRows(updatedRows);

  //   // 👇 Now correctly compute FinaltotalAmount here:
  //   const finalTotal = updatedRows
  //     .reduce((sum, r) => {
  //       const amt = parseFloat(r.Amount);
  //       return sum + (isNaN(amt) ? 0 : amt);
  //     }, 0)
  //     .toFixed(2);

  //   setFinalTotalAmount(finalTotal);

  //   // Filter and send data upwards
  //   const filteredBillingData = updatedRows
  //     .filter(
  //       (r) =>
  //         r.product !== null &&
  //         r.Qty !== "" &&
  //         !isNaN(parseFloat(r.Qty)) &&
  //         parseFloat(r.Qty) > 0
  //     )
  //     // .map((r) => ({
  //     //   productName: r.product.productName,
  //     //   categoryName: r.product.categoryName,
  //     //   hsnCode: r.product.hsnCode, // <-- Add this line
  //     //   unit: r.Unit,
  //     //   qty: parseFloat(r.Qty),
  //     //   rate: parseFloat(r.Rate),
  //     //   sch: parseFloat(r.Sch) || 0,
  //     //   schAmt: parseFloat(r.SchAmt) || 0,
  //     //   cd: parseFloat(r.CD) || 0,
  //     //   cdAmt: parseFloat(r.CDAmt) || 0,
  //     //   total: parseFloat(r.Total) || 0,
  //     //   gst: parseFloat(r.GST) || 0,
  //     //   amount: parseFloat(r.Amount) || 0,
  //     // }));

  //     .map((r) => ({
  //       productId: r.product._id, // ✅ Actual MongoDB reference
  //       itemName: r.product.productName, // Optional: for readability
  //       // categoryName: r.product.categoryName,
  //       hsnCode: r.product.hsnCode,
  //       unit: r.product.unit,
  //       qty: parseFloat(r.Qty),
  //       Free: parseFloat(r.Free) || 0,
  //       rate: parseFloat(r.Rate),
  //       sch: parseFloat(r.Sch) || 0,
  //       schAmt: parseFloat(r.SchAmt) || 0,
  //       cd: parseFloat(r.CD) || 0,
  //       cdAmt: parseFloat(r.CDAmt) || 0,
  //       total: parseFloat(r.Total) || 0,
  //       gst: parseFloat(r.GST) || 0,
  //       amount: parseFloat(r.Amount) || 0,
  //     }));
  //   onBillingDataChange(filteredBillingData, finalTotal);
  //   console.log(finalTotal, "final amount");
  // };

  // Handle keyboard shortcuts for new line and delete

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    let row = { ...updatedRows[index], [field]: value };

    // If product selected
    if (field === "product") {
      row.product = value;
      row.GST = value.gstPercent || "";
      row.Unit = value.primaryUnit || "";
      row.Rate = value.primaryPrice || "";
    }

    // If unit changed
    if (field === "Unit" && row.product) {
      const prod = row.product;
      if (value === prod.primaryUnit) {
        row.Rate = prod.primaryPrice;
      } else if (value === prod.secondaryUnit) {
        row.Rate = prod.secondaryPrice;
      }
    }

    // If quantity entered
    if (field === "Qty" && row.product) {
      const qtyNum = parseFloat(value);
      const prod = row.product;
      if (!isNaN(qtyNum) && qtyNum > 0) {
        if (qtyNum > prod.availableQty) {
          toast.error(
            `Product "${prod.productName}" has only ${prod.availableQty} ${prod.unit} in stock.`,
            { position: "top-center", autoClose: 3000 }
          );
          return; // Stop further processing
        }

        // Ensure Rate is set from selected unit
        if (row.Unit === prod.primaryUnit) {
          row.Rate = prod.primaryPrice;
        } else if (row.Unit === prod.secondaryUnit) {
          row.Rate = prod.secondaryPrice;
        }
      }
    }

    // Recalculate row with updated values
    row = recalculateRow(row);
    updatedRows[index] = row;
    setRows(updatedRows);

    // Recalculate final amount
    const finalTotal = updatedRows
      .reduce((sum, r) => {
        const amt = parseFloat(r.Amount);
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0)
      .toFixed(2);

    setFinalTotalAmount(finalTotal);

    // Send filtered billing data upwards
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
        rate: parseFloat(r.Rate),
        sch: parseFloat(r.Sch) || 0,
        schAmt: parseFloat(r.SchAmt) || 0,
        cd: parseFloat(r.CD) || 0,
        cdAmt: parseFloat(r.CDAmt) || 0,
        total: parseFloat(r.Total) || 0,
        gst: parseFloat(r.GST) || 0,
        amount: parseFloat(r.Amount) || 0,
      }));

    onBillingDataChange(filteredBillingData);
  };

  const handleKeyDown = (e, rowIndex) => {
    if (e.altKey && e.key === "n") {
      e.preventDefault();
      if (rowIndex === rows.length - 1) {
        setRows([...rows, { ...defaultRow }]);
      }
    }

    if (e.key === "Delete" && rows.length > 1) {
      e.preventDefault();
      const updatedRows = rows.filter((_, i) => i !== rowIndex);
      setRows(updatedRows);

      // Also update parent after deletion
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
          unit: r.product.unit,
          qty: parseFloat(r.Qty),
          Free: parseFloat(r.Free) || 0,
          rate: parseFloat(r.Rate),
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
      className="mt-4"
      style={{
        width: "100vw",
        padding: "0 1rem",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <h2 className="text-center mb-4">Product Invoice</h2>
      <div className="mt-3 p-3 bg-light border rounded">
        <h5>Total Items: {rows.length}</h5>
        <div className="d-flex align-items-center gap-4 text-muted mb-0">
          <strong>Shortcuts:</strong>
          <div className="d-flex align-items-center gap-3">
            <span>
              <strong>New Line:</strong> Alt + N
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

      <div className="table-responsive" style={{ overflow: "visible" }}>
        <table
          className="table table-bordered table-hover text-center"
          style={{
            border: "2px solid #dee2e6",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead className="table-secondary">
            <tr>
              {fields.map((field, idx) => (
                <th key={idx}>
                  {field === "Sch"
                    ? "Sch%"
                    : field === "CD"
                    ? "CD%"
                    : field === "CDAmt"
                    ? "CD Amt"
                    : field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} onKeyDown={(e) => handleKeyDown(e, rowIndex)}>
                {fields.map((field, colIndex) => (
                  <td key={colIndex}>
                    {field === "ItemName" ? (
                      <Select
                        className="w-100"
                        options={products.map((p) => ({
                          label: `${p.productName}`,
                          value: p._id,
                        }))}
                        value={
                          row.product
                            ? {
                                label: `${row.product.productName}`,
                                value: row.product._id,
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const selectedProduct = products.find(
                            (p) => p._id === selectedOption?.value
                          );
                          console.log("Selected product:", selectedProduct);
                          handleChange(rowIndex, "product", selectedProduct);
                        }}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          container: (base) => ({ ...base, minWidth: "200px" }),
                        }}
                      />
                    ) : field === "Unit" ? (
                      <select
                        className="form-control"
                        value={row.product?.unit}
                        onChange={(e) =>
                          handleChange(rowIndex, "Unit", e.target.value)
                        }
                      >
                        <option value="">Select Unit</option>
                        {row.product?.primaryUnit && (
                          <option value={row.product?.primaryUnit}>
                            {row.product?.primaryUnit}
                          </option>
                        )}
                        {row.product?.secondaryUnit && (
                          <option value={row.product?.secondaryUnit}>
                            {row.product?.secondaryUnit}
                          </option>
                        )}
                      </select>
                    ) : ["SchAmt", "CDAmt", "Total", "Amount"].includes(
                        field
                      ) ? (
                      <input
                        type="number"
                        className="form-control"
                        value={row[field]}
                        readOnly
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
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

            {/* Final total amount row */}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
              <td colSpan={fields.length - 1} className="text-end">
                Final Amount
              </td>
              <td>{finalTotalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductBillingReport;
