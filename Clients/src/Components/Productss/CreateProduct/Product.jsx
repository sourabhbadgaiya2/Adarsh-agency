import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import axios from "../../../Config/axios";
const API_BASE = import.meta.env.VITE_API;
const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");
import Image from "react-bootstrap/Image";
import Loader from "../../Loader";
import toast from "react-hot-toast";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Modal,
} from "react-bootstrap";

const Product = ({ onSuccess, onCancel, productToEdit }) => {
  const [loading, setLoading] = useState(false);

  // 👇 Add refs
  const companyIdRef = useRef();
  const productNameRef = useRef();

  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    companyId: "",
    productName: "",
    productImg: null,
    // unit: "", // New field
    mrp: "", // New field
    salesRate: "", // New field
    purchaseRate: "", // New field
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
      // console.log(res.data, "res.data");
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
        const [
          companyRes,
          // categoryRes,
          // subCategoryRes
        ] = await Promise.all([
          axios.get("/company"),
          axios.get("/category"),
          axios.get("/Subcategory"),
        ]);

        setCompanies(companyRes.data || []);
        // setCategories(categoryRes.data || []);
        // setSubCategories(subCategoryRes.data || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchDropdownData();
    fetchProducts(); // Load products on initial mount
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
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  // ---------------------------------------------------
  const handleEdit = (index) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const selectedProduct = products[index];
    setFormData({
      _id: selectedProduct._id, // <-- Add this
      companyId: selectedProduct.companyId?._id || "",
      productName: selectedProduct.productName || "",
      // unit: selectedProduct.unit || "",
      mrp: selectedProduct.mrp || "",
      salesRate: selectedProduct.salesRate || "",
      purchaseRate: selectedProduct.purchaseRate || "",
      availableQty: selectedProduct.availableQty || "",
      hsnCode: selectedProduct.hsnCode || "",
      gstPercent: selectedProduct.gstPercent || 9,
      primaryUnit: selectedProduct.primaryUnit || "",
      secondaryUnit: selectedProduct.secondaryUnit || "",
      primaryPrice: selectedProduct.primaryPrice || 0,
      secondaryPrice: selectedProduct.secondaryPrice || 0,
    });
    setEditIndex(index);
  };

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

  const handleDelete = async (index) => {
    setLoading(true);
    const productToDelete = products[index];
    if (!productToDelete?._id) return;
    try {
      await axios.delete(`/product/${productToDelete._id}`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container-fluid mt-2'>
      {/* <h3 className='mb-3'>Create Product</h3> */}
      <div className='row-2'>
        {/* Form Section */}
        <div className='col-md-12 mb-4'>
          <div className='card shadow border-0'>
            <div className='card-body'>
              <h5 className='card-title text-primary mb-3'>
                {editIndex !== null ? "Edit Product" : "Add New Product"}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className='row'>
                  {/* Brand */}
                  <div className='col-md-6 mb-3'>
                    <label>Brand</label>
                    <select
                      ref={companyIdRef}
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
                      ref={productNameRef}
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
                      type='file'
                      name='productImg'
                      onChange={handlePhotoChange}
                      className='form-control'
                    />
                  </div>

                  {/* Category */}
                  {/* <div className="col-md-4 mb-3">
                    <label>Category</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="form-control"
                      //   
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.cat}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  {/* SubCategory */}
                  {/* <div className="col-md-4 mb-3">
                    <label>Sub Category</label>
                    <select
                      name="subCategoryId"
                      value={formData.subCategoryId}
                      onChange={handleChange}
                      className="form-control"
                      //   
                    >
                      <option value="">Select SubCategory</option>
                      {subCategories.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.subCat}
                        </option>
                      ))}
                    </select>
                  </div> */}

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
                    />
                  </div>

                  <div className='col-md-3 mb-3'>
                    <label>KG Price</label>
                    <input
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
                      type='number'
                      name='secondaryPrice'
                      value={formData.secondaryPrice}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </div>

                  {/* ----------------------------------------------------------- */}

                  {/* ------------------------Unit dropdown / MRP / Purchase-Sales Rate--------------------- */}

                  {/* <div className="col-md-3 mb-3">
                    unit 
                    <label>Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={(e) => {
                        const selectedUnit = e.target.value;
                        let mrpValue = "";
                        setFormData((prev) => ({
                          ...prev,
                          unit: selectedUnit,
                          mrp: mrpValue,
                        }));
                      }}
                      className="form-control"
                    >
                      <option value="">Select Unit</option>
                      <option value="KG">KG</option>
                      <option value="Pcs">Pcs</option>
                    </select>
                  </div>*}

                  {/* MRP */}

                  <div className='col-md-3 mb-3'>
                    <label>MRP</label>
                    <input
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

        {/* Product List Table Section */}
        {!onSuccess && (
          <div className='col-md-12 mb-4'>
            <div className='card shadow border-0'>
              <div className='card-body'>
                <h5 className='card-title text-success mb-3'>Product List</h5>
                {products.length === 0 ? (
                  <p>No products added yet.</p>
                ) : (
                  <div className='table-responsive'>
                    <table className='table table-bordered mt-4'>
                      <thead className='thead-light'>
                        <tr>
                          <th>Product Image</th>
                          <th>Product Name</th>
                          <th>Brand</th>
                          <th>HSN Code</th>
                          <th>MRP</th>
                          <th>Sales Rate</th>
                          <th>Purchase Rate</th>
                          {/*<th>Primary Price</th>*/}
                          <th>Available QTY.</th>
                          <th>GST%</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={product._id}>
                            <td>
                              {product.productImg ? (
                                <Image
                                  src={`${IMAGE_BASE}/Images/${product.productImg}`}
                                  roundedCircle
                                  width={50}
                                  height={50}
                                />
                              ) : (
                                "No Photo"
                              )}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {product.productName}
                            </td>
                            <td>{product.companyId?.name || "-"}</td>
                            <td>{product.hsnCode}</td>
                            <td>{product.mrp}</td>
                            <td>{product.salesRate}</td>
                            <td>{product.purchaseRate}</td>
                            {/*  <td>{product.primaryUnit}</td>
                          <td>{product.primaryPrice}</td>*/}
                            <td>{product.availableQty}</td>
                            <td>{product.gstPercent}</td>
                            <td>
                              <button
                                className='btn btn-sm btn-warning me-2'
                                onClick={() => handleEdit(index)}
                              >
                                <PencilFill />
                              </button>
                              <button
                                className='btn btn-sm btn-danger'
                                onClick={() => handleDelete(index)}
                              >
                                <TrashFill />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
