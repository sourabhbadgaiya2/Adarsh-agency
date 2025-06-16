import React, { useEffect, useState } from "react";
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
import axios from "../../Config/axios";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { MdOutlineKeyboardHide } from "react-icons/md";

import { confirmAlert } from "react-confirm-alert";
import Product from "../Productss/CreateProduct/Product";
import axiosInstance from "../../Config/axios";
import dayjs from "dayjs";

const PurchaseForm = () => {
  const [vendors, setVendors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // console.log(purchases, "DATA");

  const [showProductModal, setShowProductModal] = useState(false);

  const [isEditingProductName, setIsEditingProductName] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");

  // ! edit options
  const handleOpenProductModal = () => setShowProductModal(true);
  const handleCloseProductModal = () => setShowProductModal(false);

  const [purchaseData, setPurchaseData] = useState({
    vendorId: "",
    date: new Date().toISOString().split("T")[0],
    entryNumber: "", // <-- new
    item: {
      entryNumber: "", // <-- new
      partyNo: "", // <-- Add this line
      productId: "",
      companyId: "",
      purchaseRate: "",
      quantity: "",
      availableQty: "",
      totalAmount: "",
      discountPercent: "0", // 🔄 NEW
      schemePercent: "0", // 🔄 NEW
    },
  });

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [itemsList, setItemsList] = useState([]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [vRes, cRes, pRes, purRes] = await Promise.all([
        axios.get("/vendor"),
        axios.get("/company"),
        axios.get("/product"),
        axios.get("/purchase"),
      ]);
      setVendors(vRes.data);
      setCompanies(cRes.data);
      setProducts(pRes.data || []);
      setPurchases(purRes.data || []);

      setPurchaseData((prev) => ({
        ...prev,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntryNumber = async () => {
    try {
      const res = await axios.get("/purchase/next-entry-number");
      setPurchaseData((prev) => ({
        ...prev,
        entryNumber: res.data.nextEntryNumber,
      }));
    } catch (err) {
      console.error("Failed to fetch entry number:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchEntryNumber();
  }, []);

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    setPurchaseData((prev) => {
      const updatedItem = { ...prev.item, [name]: value };

      if (name === "productId") {
        const selectedProduct = products.find((p) => p._id === value);
        if (selectedProduct) {
          updatedItem.availableQty = selectedProduct.availableQty;
          updatedItem.purchaseRate = selectedProduct.purchaseRate;
          updatedItem.quantity = "";
          updatedItem.totalAmount = "";
          updatedItem.discountPercent = "";
          updatedItem.schemePercent = "";
        }
      }

      const rate =
        parseFloat(
          name === "purchaseRate" ? value : updatedItem.purchaseRate
        ) || 0;

      const qty =
        parseFloat(name === "quantity" ? value : updatedItem.quantity) || 0;

      const dis =
        parseFloat(
          name === "discountPercent" ? value : updatedItem.discountPercent
        ) || 0;

      const scm =
        parseFloat(
          name === "schemePercent" ? value : updatedItem.schemePercent
        ) || 0;

      if (rate && qty) {
        // ✅ Successive discount application
        const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
        const totalAmount = finalRate * qty;

        updatedItem.totalAmount = totalAmount.toFixed(2);
      }

      return { ...prev, item: updatedItem };
    });
  };

  const addItemToList = () => {
    const { productId, companyId, quantity, purchaseRate } = purchaseData.item;
    if (!productId || !companyId || !quantity || !purchaseRate) {
      toast.error("Please fill all item fields");
      return;
    }

    const newItem = {
      ...purchaseData.item,
      purchaseDate: purchaseData.date,
      entryNumber: purchaseData.entryNumber,
      partyNo: purchaseData.partyNo,
    };

    // setItemsList((prev) => [...prev, newItem]);
    setItemsList([...itemsList, newItem]);

    setPurchaseData((prev) => ({
      ...prev,
      item: {
        productId: "",
        companyId: "",
        purchaseRate: "",
        quantity: "",
        availableQty: "",
        totalAmount: "",
        discountPercent: "", // 🔄 NEW
        schemePercent: "", // 🔄 NEW
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purchaseData.vendorId || itemsList.length === 0) {
      toast.error("Please select a vendor and add at least one item");
      return;
    }
    setLoading(true);

    try {
      const dataToSend = {
        vendorId: purchaseData.vendorId,
        date: purchaseData.date, // include this
        partyNo: purchaseData.partyNo,
        entryNumber: purchaseData.entryNumber, // 🔄 SEND backend-generated entry number
        items: itemsList,
      };

      if (editingId) {
        await axios.put(`/purchase/${editingId}`, dataToSend);
        toast.success("Purchase updated successfully");
      } else {
        await axios.post("/purchase", dataToSend);
        fetchInitialData(); // 🔄 Refresh list after adding
        fetchEntryNumber(); // 🔄 Get next entry number for next purchase
        toast.success("Purchase saved successfully");
      }

      setPurchaseData({
        vendorId: "",
        date: getCurrentDate(), // ✅ Maintain current date
        item: {
          productId: "",
          companyId: "",
          purchaseRate: "",
          quantity: "",
          availableQty: "",
          totalAmount: "",
        },
      });
      setItemsList([]);
      setEditingId(null);
      fetchInitialData();
    } catch (err) {
      // console.error(err);

      if (
        err?.response?.data?.error ===
        "Purchase validation failed: partyNo: Path `partyNo` is required."
      ) {
        return toast.error("Part No. is required");
      }

      toast.error(
        err?.response?.data?.error || "Failed to save/update purchase"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this purchase?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setLoading(true);
              await axios.delete(`/purchase/${id}`);
              toast.success("Purchase deleted");
              fetchInitialData();
            } catch (err) {
              toast.error("Failed to delete purchase");
            } finally {
              setLoading(false);
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // do nothing
          },
        },
      ],
    });
  };

  const removeItem = (index) => {
    setItemsList((prev) => prev.filter((_, i) => i !== index));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      console.log(e);
      addItemToList();
    }
  };

  // !EDIT EDIT EDIT.

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F3") {
        e.preventDefault();
        const selectedProduct = products.find(
          (p) => p._id === purchaseData.item.productId
        );
        if (selectedProduct) {
          setEditedProductName(selectedProduct.productName);
          setIsEditingProductName(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [purchaseData.item.productId, products]);

  const handleSaveEditedName = async () => {
    const productId = purchaseData.item.productId;
    try {
      await axiosInstance.put(`/product/${productId}`, {
        productName: editedProductName,
      });

      // Optionally update product list in frontend too
      const updatedProducts = products.map((p) =>
        p._id === productId ? { ...p, productName: editedProductName } : p
      );
      setProducts(updatedProducts);

      setIsEditingProductName(false);
    } catch (err) {
      console.error("Error updating product name:", err);
      alert("Failed to update product name.");
      setIsEditingProductName(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='mx-5'>
      <Card className='p-4 mb-4'>
        <h4 className='mb-3'>{editingId ? "Edit Purchase" : "Add Purchase"}</h4>
        <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <Row className='mb-3  d-flex justify-content-between align-items-end'>
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Label>Vendor</Form.Label>
                <Form.Select
                  name='vendorId'
                  value={purchaseData.vendorId}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      vendorId: e.target.value,
                    }))
                  }
                >
                  <option value=''>Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} md={2} className='text-end'>
              <Form.Group>
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  type='date'
                  name='date'
                  value={purchaseData.date}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-3  d-flex justify-content-between align-items-end'>
            <Col xs='auto'>
              <Form.Group>
                <Form.Label>Entry No.</Form.Label>
                <Form.Control
                  type='text'
                  name='entryNumber'
                  value={purchaseData.entryNumber}
                  readOnly
                  style={{ minWidth: "100px" }}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Party No.</Form.Label>
                <Form.Control
                  type='text'
                  name='partyNo'
                  value={purchaseData.partyNo}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      partyNo: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* //! Add BUttons */}
          <Row className='mt-3 align-items-center'>
            {/* Notes - Left Side */}
            <Col xs={12} md={6}>
              <p className='mb-1'>
                <strong>Add More Items:</strong>{" "}
                <span style={{ color: "gray", marginRight: "10px" }}>
                  press Enter
                </span>
                <strong className=''>Edit Product Name:</strong>{" "}
                <span style={{ color: "gray" }}>press F3</span>
              </p>
            </Col>

            {/* Buttons - Right Side */}
            <Col
              xs={12}
              md={6}
              className='d-flex justify-content-end gap-3 mb-2'
            >
              <Button variant='primary' onClick={handleOpenProductModal}>
                <BsPlusCircle size={16} style={{ marginRight: "4px" }} />
              </Button>
              <Button variant='primary' onClick={addItemToList}>
                <MdOutlineKeyboardHide
                  size={16}
                  style={{ marginRight: "4px" }}
                />
              </Button>
            </Col>
          </Row>

          {/* //! Form */}

          <div style={{ overflowX: "auto" }}>
            <Row className='mb-3 flex-nowrap'>
              <Col md='auto'>
                <Form.Group>
                  <Form.Label>Brand</Form.Label>
                  <Form.Select
                    name='companyId'
                    value={purchaseData.item.companyId}
                    onChange={handleItemChange}
                  >
                    <option value=''>Select Company</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md='auto'>
                <Form.Group>
                  <Form.Label>Product</Form.Label>
                  {/* <Form.Select
                    name='productId'
                    value={purchaseData.item.productId}
                    onChange={handleItemChange}
                  >
                    <option value=''>Select Product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.productName}
                      </option>
                    ))}
                  </Form.Select> */}

                  {isEditingProductName ? (
                    <input
                      type='text'
                      value={editedProductName}
                      onChange={(e) => setEditedProductName(e.target.value)}
                      onBlur={handleSaveEditedName} // Save when focus is lost
                      autoFocus
                      className='form-select' // 👈 Match Bootstrap dropdown style
                    />
                  ) : (
                    <Form.Select
                      name='productId'
                      value={purchaseData.item.productId}
                      onChange={handleItemChange}
                    >
                      <option value=''>Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.productName}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              </Col>
              {[
                { label: "Qty", name: "quantity" },
                {
                  label: "Available Qty",
                  name: "availableQty",
                  readOnly: true,
                },
                { label: "Rate", name: "purchaseRate" },
                { label: "DIS%", name: "discountPercent" },
                { label: "SCM%", name: "schemePercent" },
                { label: "Total", name: "totalAmount", readOnly: true },
              ].map(({ label, name, readOnly = false }) => (
                <Col key={name} md='auto'>
                  <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      type='number'
                      name={name}
                      value={purchaseData.item[name]}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      placeholder={`Enter ${label}`}
                      readOnly={readOnly}
                      className='auto-width-input'
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </div>

          {itemsList.length > 0 && (
            <Table striped bordered className='mt-3'>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product</th>
                  <th>Company</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>DIS%</th> {/* ✅ New */}
                  <th>SCM%</th> {/* ✅ New */}
                  <th>Total</th>
                  <th>Purchase Date</th>
                  <th>Entry No.</th>
                  <th>Party No.</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, index) => {
                  const product = products.find(
                    (p) => p._id === item.productId
                  );
                  const company = companies.find(
                    (c) => c._id === item.companyId
                  );

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td> {/* ✅ Show serial number */}
                      <td>{product?.productName || ""}</td>
                      <td>{company?.name || ""}</td>
                      <td>{item.quantity || ""}</td>
                      <td>{item.purchaseRate || ""}</td>
                      <td>{item.discountPercent || ""}</td>
                      <td>{item.schemePercent || ""}</td>
                      <td>{item.totalAmount || ""}</td>
                      <td>{item.purchaseDate || ""}</td> {/* Corrected here */}
                      <td>{item.entryNumber || ""}</td>
                      <td>{item.partyNo || ""}</td>
                      <td>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <Button type='submit' className='mt-3' variant='primary'>
            {editingId ? "Update Purchase" : "Save Purchase"}
          </Button>
        </Form>
      </Card>

      <Card className='p-3'>
        <h5>Purchase List</h5>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Entry No.</th>
              <th>Party No.</th>
              <th>Vendor</th>
              <th>Items Count</th>
              <th>Item Quantity</th>
              <th>Item Rate</th>
              <th>Total Amount</th>
              <th>Purchase Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* {purchases.map((p) => (
              <tr key={p._id}>
                <td>{p.entryNumber}</td>
                <td>{p.partyNo}</td>
                <td>{p.vendorId?.name}</td>
                <td>{p.items.length}</td>
                <td>{p.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                <td>{p.items.reduce((sum, i) => sum + i.purchaseRate, 0)}</td>
                <td>{p.items.reduce((sum, i) => sum + i.totalAmount, 0)}</td>
                <td>{dayjs(p.date).format("DD MMM YYYY")}</td>

                <td>
                  <Button
                    variant='danger'
                    size='md'
                    onClick={() => handleDelete(p._id)}
                  >
                    <BsTrash style={{ marginRight: "0px" }} />
                  </Button>
                </td>
              </tr>
            ))} */}

            {purchases.map((p) => {
              const productNames = p.items
                .map((i) => i.productId?.productName)
                .join(", ");
              const quantities = p.items
                .map((i) => `${i.productId?.productName}: ${i.quantity}`)
                .join(", ");
              const rates = p.items
                .map((i) => `${i.productId?.productName}: ₹${i.purchaseRate}`)
                .join(", ");
              const amounts = p.items
                .map((i) => `${i.productId?.productName}: ₹${i.totalAmount}`)
                .join(", ");

              return (
                <tr key={p._id}>
                  <td>{p.entryNumber}</td>
                  <td>{p.partyNo}</td>
                  <td>{p.vendorId?.name}</td>

                  <td>
                    <OverlayTrigger
                      placement='top'
                      overlay={<Tooltip>{productNames}</Tooltip>}
                    >
                      <span>{p.items.length}</span>
                    </OverlayTrigger>
                  </td>

                  <td>
                    <OverlayTrigger
                      placement='top'
                      overlay={<Tooltip>{quantities}</Tooltip>}
                    >
                      <span>
                        {p.items.reduce((sum, i) => sum + i.quantity, 0)}
                      </span>
                    </OverlayTrigger>
                  </td>

                  <td>
                    <OverlayTrigger
                      placement='top'
                      overlay={<Tooltip>{rates}</Tooltip>}
                    >
                      <span>
                        {p.items.reduce((sum, i) => sum + i.purchaseRate, 0)}
                      </span>
                    </OverlayTrigger>
                  </td>

                  <td>
                    <OverlayTrigger
                      placement='top'
                      overlay={<Tooltip>{amounts}</Tooltip>}
                    >
                      <span>
                        {p.items.reduce((sum, i) => sum + i.totalAmount, 0)}
                      </span>
                    </OverlayTrigger>
                  </td>

                  <td>{dayjs(p.date).format("DD MMM YYYY")}</td>

                  <td>
                    <Button
                      variant='danger'
                      size='md'
                      onClick={() => handleDelete(p._id)}
                    >
                      <BsTrash />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <Modal
        show={showProductModal}
        onHide={handleCloseProductModal}
        size='lg'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Product
            onSuccess={() => {
              handleCloseProductModal(); // Close modal after success
              fetchInitialData(); // Refresh product list
            }}
            onCancel={handleCloseProductModal} // Optional cancel handler
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PurchaseForm;
