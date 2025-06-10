import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
} from "react-bootstrap";
import axios from "../../Config/axios";

const PurchaseForm = () => {
  const [vendors, setVendors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [purchaseData, setPurchaseData] = useState({
    vendorId: "",
    item: {
      productId: "",
      companyId: "",
      purchaseRate: "",
      quantity: "",
      availableQty: "",
      totalAmount: "",
    },
  });

  const [itemsList, setItemsList] = useState([]);

  const fetchInitialData = async () => {
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
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
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
        }
      }

      if (name === "quantity" || name === "purchaseRate") {
        const quantity = name === "quantity" ? value : prev.item.quantity;
        const rate = name === "purchaseRate" ? value : prev.item.purchaseRate;
        if (quantity && rate) {
          updatedItem.totalAmount = parseFloat(quantity) * parseFloat(rate);
        }
      }

      return { ...prev, item: updatedItem };
    });
  };

  const addItemToList = () => {
    const { productId, companyId, quantity, purchaseRate } = purchaseData.item;
    if (!productId || !companyId || !quantity || !purchaseRate) {
      alert("Please fill all item fields");
      return;
    }

    setItemsList((prev) => [...prev, purchaseData.item]);
    setPurchaseData((prev) => ({
      ...prev,
      item: {
        productId: "",
        companyId: "",
        purchaseRate: "",
        quantity: "",
        availableQty: "",
        totalAmount: "",
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purchaseData.vendorId || itemsList.length === 0) {
      alert("Please select a vendor and add at least one item");
      return;
    }

    try {
      const dataToSend = {
        vendorId: purchaseData.vendorId,
        items: itemsList,
      };

      if (editingId) {
        await axios.put(`/purchase/${editingId}`, dataToSend);
        alert("Purchase updated successfully");
      } else {
        await axios.post("/purchase", dataToSend);
        alert("Purchase saved successfully");
      }

      setPurchaseData({
        vendorId: "",
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
      console.error(err);
      alert("Failed to save/update purchase");
    }
  };

  // const handleEdit = (purchase) => {
  //   setPurchaseData({
  //     vendorId: purchase.vendorId._id,
  //     item: {
  //       productId: "",
  //       companyId: "",
  //       purchaseRate: "",
  //       quantity: "",
  //       availableQty: "",
  //       totalAmount: "",
  //     },
  //   });
  //   setItemsList(purchase.items);
  //   setEditingId(purchase._id);
  // };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      try {
        await axios.delete(`/purchase/${id}`);
        alert("Purchase deleted");
        fetchInitialData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete purchase");
      }
    }
  };

  const removeItem = (index) => {
    setItemsList((prev) => prev.filter((_, i) => i !== index));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      addItemToList();
    }
  };

  return (
    <div className="mx-5">
      <Card className=" p-4 mb-4">
        <h4 className="mb-3">{editingId ? "Edit Purchase" : "Add Purchase"}</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Vendor</Form.Label>
                <Form.Select
                  name="vendorId"
                  value={purchaseData.vendorId}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      vendorId: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <p>
                <strong>Add More Items : </strong>{" "}
                <span style={{ color: "gray" }}>press Enter</span>
              </p>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={2}>
              <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Select
                  name="companyId"
                  value={purchaseData.item.companyId}
                  onChange={handleItemChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Brand"
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Product</Form.Label>
                <Form.Select
                  name="productId"
                  value={purchaseData.item.productId}
                  onChange={handleItemChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Product"
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.productName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Rate</Form.Label>
                <Form.Control
                  type="number"
                  name="purchaseRate"
                  value={purchaseData.item.purchaseRate}
                  onChange={handleItemChange}
                  onKeyDown={handleKeyDown}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Qty</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={purchaseData.item.quantity}
                  onChange={handleItemChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Qty"
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Available Qty</Form.Label>
                <Form.Control
                  type="number"
                  name="availableQty"
                  value={purchaseData.item.availableQty}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="number"
                  name="totalAmount"
                  value={purchaseData.item.totalAmount}
                  readOnly
                />
              </Form.Group>
            </Col>
            {/* <Col md={2} className="d-flex align-items-end">
              <Button variant="info" onClick={addItemToList}>
                Add Item
              </Button>
            </Col> */}
          </Row>

          {itemsList.length > 0 && (
            <Table striped bordered className="mt-3">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Company</th>
                  <th>Rate</th>
                  <th>Qty</th>
                  <th>Total</th>
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
                      <td>{product?.productName}</td>
                      <td>{company?.name}</td>
                      <td>{item.purchaseRate}</td>
                      <td>{item.quantity}</td>
                      <td>{item.totalAmount}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
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

          <Button type="submit" className="mt-3" variant="primary">
            {editingId ? "Update Purchase" : "Save Purchase"}
          </Button>
        </Form>
      </Card>

      <Card className="p-3">
        <h5>Purchase List</h5>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Items Count</th>
              <th>Item Quantity</th>
              <th>Item Rate</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p._id}>
                <td>{p.vendorId?.name}</td>
                <td>{p.items.length}</td>
                <td>{p.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                <td>{p.items.reduce((sum, i) => sum + i.purchaseRate, 0)}</td>
                <td>{p.items.reduce((sum, i) => sum + i.totalAmount, 0)}</td>
                <td>
                  {/* <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </Button>{" "} */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default PurchaseForm;
