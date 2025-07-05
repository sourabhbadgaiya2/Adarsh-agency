import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "../../../Config/axios";
const API_BASE = import.meta.env.VITE_API;
const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");
import Image from "react-bootstrap/Image";
import Loader from "../../Loader";
import toast from "react-hot-toast";

const ProductForm = ({ onSuccess, productToEdit }) => {
  const [loading, setLoading] = useState(false);

  //  Add refs
  const companyIdRef = useRef();
  const productNameRef = useRef();
  const inputRefs = useRef([]);
  const [photo, setPhoto] = useState(null);

  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    companyId: "",
    productName: "",
    productImg: null,
    // unit: "",
    mrp: "",
    salesRate: "",
    purchaseRate: "",
    availableQty: 0,
    hsnCode: "",
    gstPercent: 0,
    // categoryId: "",
    // subCategoryId: "",
    primaryUnit: "",
    secondaryUnit: "",
    primaryPrice: "",
    secondaryPrice: "",
  });

  const [companies, setCompanies] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/product");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [companyRes] = await Promise.all([
          axios.get("/company"),
          axios.get("/category"),
          axios.get("/Subcategory"),
        ]);

        setCompanies(companyRes.data || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchDropdownData();
    fetchProducts();
  }, []);

  // ! EDit
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        _id: productToEdit._id || "",
        companyId: productToEdit.companyId?._id || "",
        productName: productToEdit.productName || "",
        mrp: productToEdit.mrp || "",
        salesRate: productToEdit.salesRate || "",
        purchaseRate: productToEdit.purchaseRate || "",
        availableQty: productToEdit.availableQty || "",
        hsnCode: productToEdit.hsnCode || "",
        gstPercent: productToEdit.gstPercent || 9,
        primaryUnit: productToEdit.primaryUnit || "",
        secondaryUnit: productToEdit.secondaryUnit || "",
        primaryPrice: productToEdit.primaryPrice || "",
        secondaryPrice: productToEdit.secondaryPrice || "",
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    if (type === "number" && value !== "") {
      processedValue = Number(value);

      if (name === "availableQty" && processedValue < 0) {
        processedValue = 0;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };
  // --------------------------------------------

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  // ---------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.companyId) {
        toast.error("Please select a Brand.");
        companyIdRef.current?.focus();
        setLoading(false);
        return;
      }

      if (!formData.productName.trim()) {
        toast.error("Please enter the product name.");
        productNameRef.current?.focus();
        setLoading(false);
        return;
      }

      if (photo) {
        const data = new FormData();
        data.append("companyId", formData.companyId);
        data.append("productName", formData.productName);
        data.append("mrp", formData.mrp);
        data.append("salesRate", formData.salesRate);
        data.append("purchaseRate", formData.purchaseRate);
        data.append("availableQty", formData.availableQty);
        data.append("hsnCode", formData.hsnCode);
        data.append("gstPercent", formData.gstPercent);
        data.append("primaryUnit", formData.primaryUnit);
        data.append("secondaryUnit", formData.secondaryUnit);
        data.append("primaryPrice", formData.primaryPrice);
        data.append("secondaryPrice", formData.secondaryPrice);
        data.append("productImg", photo);

        await axios.post("/product", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Product created successfully with image!");
      } else {
        const productData = {
          companyId: formData.companyId,
          productName: formData.productName,
          mrp: formData.mrp,
          salesRate: formData.salesRate,
          purchaseRate: formData.purchaseRate,
          availableQty: formData.availableQty || 0,
          hsnCode: formData.hsnCode,
          gstPercent: formData.gstPercent,
          primaryUnit: formData.primaryUnit,
          secondaryUnit: formData.secondaryUnit,
          primaryPrice: formData.primaryPrice,
          secondaryPrice: formData.secondaryPrice,
          lastUpdated: new Date(),
        };

        if (formData._id) {
          await axios.put(`/product/${formData._id}`, productData);
          toast.success("Product updated successfully!");
        } else {
          await axios.post("/product", productData);
          toast.success("Product created successfully!");
        }
      }

      // Reset form
      setFormData({
        companyId: "",
        productName: "",
        productImg: null,
        mrp: "",
        salesRate: "",
        purchaseRate: "",
        availableQty: 0,
        hsnCode: "",
        gstPercent: 9,
        primaryUnit: "",
        secondaryUnit: "",
        primaryPrice: "",
        secondaryPrice: "",
      });
      setPhoto(null); // Reset image
      setEditIndex(null);
      fetchProducts();

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error submitting product:", err);
      toast.error("Failed to submit product.");
    } finally {
      setLoading(false);
    }
  };

  // !

  const handleKeyDown = (e, index) => {
    const totalFields = inputRefs.current.length;
    const input = inputRefs.current[index];

    const next = () => {
      const nextIndex = index + 1;
      if (nextIndex < totalFields) inputRefs.current[nextIndex]?.focus();
    };

    const prev = () => {
      const prevIndex = index - 1;
      if (prevIndex >= 0) inputRefs.current[prevIndex]?.focus();
    };

    if (e.key === "Enter") {
      e.preventDefault();
      next();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      prev();
    }

    if (e.ctrlKey && e.key === "q") {
      e.preventDefault();
      handleSubmit(e);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      next();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    }

    if (e.key === "ArrowLeft") {
      try {
        const pos = input.selectionStart;
        if (pos === 0 || pos === null || pos === undefined) {
          e.preventDefault();
          prev();
        }
      } catch {
        e.preventDefault(); // fallback for type="number"
        prev();
      }
    }

    if (e.key === "ArrowRight") {
      try {
        const pos = input.selectionStart;
        if (pos === input.value.length || pos === null || pos === undefined) {
          e.preventDefault();
          next();
        }
      } catch {
        e.preventDefault(); // fallback for type="number"
        next();
      }
    }
  };

  return (
    <div className='col-md-12 mb-4'>
      <div className='card shadow border-0'>
        <div className='card-body'>
          <form onSubmit={handleSubmit}>
            <div className='row'>
              {/* Brand */}
              <div className='col-md-6 mb-3'>
                <label>Brand</label>
                <select
                  ref={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  name='companyId'
                  value={formData.companyId}
                  onChange={handleChange}
                  className='form-control'
                >
                  <option value=''>Select Brand</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Other inputs */}
              <div className='col-md-6 mb-3'>
                <label>Product Name</label>
                <input
                  ref={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  type='text'
                  name='productName'
                  value={formData.productName}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>

              <div className='col-md-6 mb-3'>
                <label>Product Image</label>
                <input
                  ref={(el) => (inputRefs.current[2] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                  type='file'
                  name='productImg'
                  onChange={handlePhotoChange}
                  className='form-control'
                />
              </div>

              {/* ------------Primary and Secondary Unit / Price code------------------- */}
              <div className='col-md-3 mb-3'>
                <label>Unit (e.g. KG) </label>
                <input
                  type='text'
                  name='primaryUnit'
                  placeholder='e.g. KG'
                  value={formData.primaryUnit}
                  onChange={handleChange}
                  className='form-control'
                  ref={(el) => (inputRefs.current[3] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                />
              </div>

              <div className='col-md-3 mb-3'>
                <label>KG Price</label>
                <input
                  ref={(el) => (inputRefs.current[4] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                  type='number'
                  name='primaryPrice'
                  value={formData.primaryPrice}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>

              <div className='col-md-3 mb-3'>
                <label>Unit (e.g. Pieces) </label>
                <input
                  ref={(el) => (inputRefs.current[5] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                  type='text'
                  name='secondaryUnit'
                  placeholder='e.g. Pcs'
                  value={formData.secondaryUnit}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>

              <div className='col-md-3 mb-3'>
                <label>Pieces Price</label>
                <input
                  ref={(el) => (inputRefs.current[6] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 6)}
                  type='number'
                  name='secondaryPrice'
                  value={formData.secondaryPrice}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>

              {/* MRP */}

              <div className='col-md-3 mb-3'>
                <label>MRP</label>
                <input
                  ref={(el) => (inputRefs.current[7] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 7)}
                  type='number'
                  name='mrp'
                  value={formData.mrp}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>

              {/* Purchase Rate */}
              <div className='col-md-3 mb-3'>
                <label>Purchase Rate</label>
                <input
                  ref={(el) => (inputRefs.current[8] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 8)}
                  type='number'
                  name='purchaseRate'
                  value={formData.purchaseRate}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>

              {/* sales Rate */}
              <div className='col-md-3 mb-3'>
                <label>Sales Rate</label>
                <input
                  ref={(el) => (inputRefs.current[9] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 9)}
                  type='number'
                  name='salesRate'
                  value={formData.salesRate}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>
              {/* ------------------------------------------------------------------------------------- */}

              <div className='col-md-2 mb-3'>
                <label>Available Qty</label>
                <input
                  ref={(el) => (inputRefs.current[10] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 10)}
                  type='number'
                  name='availableQty'
                  value={formData.availableQty}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>
              {/* HSN */}
              <div className='col-md-3 mb-3'>
                <label>HSN Code</label>
                <input
                  ref={(el) => (inputRefs.current[11] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 11)}
                  type='text'
                  name='hsnCode'
                  value={formData.hsnCode}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>

              {/* gst */}
              <div className='col-md-3 mb-3'>
                <label>GST %</label>
                <input
                  ref={(el) => (inputRefs.current[12] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 12)}
                  type='Number'
                  name='gstPercent'
                  value={formData.gstPercent}
                  onChange={handleChange}
                  className='form-control'
                />
              </div>
            </div>
            <div className=''>
              <button type='submit' className='btn btn-primary'>
                {editIndex !== null || productToEdit
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
