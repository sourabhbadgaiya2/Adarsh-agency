// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Card,
//   Table,
//   Modal,
// } from "react-bootstrap";
// import axios from "../../Config/axios";
// import Loader from "../Loader";
// import toast from "react-hot-toast";
// import { BsPlusCircle, BsTrash } from "react-icons/bs";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";

// import { MdModeEdit, MdOutlineKeyboardHide } from "react-icons/md";

// import { confirmAlert } from "react-confirm-alert";
// import Product from "../Productss/CreateProduct/Product";
// import axiosInstance from "../../Config/axios";
// import dayjs from "dayjs";

// const PurchaseForm = () => {
//   const [vendors, setVendors] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [showProductModal, setShowProductModal] = useState(false);

//   const [isEditingProductName, setIsEditingProductName] = useState(false);
//   const [editedProductName, setEditedProductName] = useState("");

//   const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);

//   const [editItemIndex, setEditItemIndex] = useState(null);
//   const [editingPurchaseId, setEditingPurchaseId] = useState(null);
//   const [EditPurchaseId, setEditPurchaseId] = useState({});

//   // ! edit options
//   // const handleOpenProductModal = () => setShowProductModal(true);
//   const handleOpenProductModal = () => {
//     setSelectedProductToEdit(null); // ✅ Ensure it opens in ADD mode
//     setShowProductModal(true);
//   };
//   const handleCloseProductModal = () => setShowProductModal(false);

//   const [purchaseData, setPurchaseData] = useState({
//     vendorId: "",
//     date: new Date().toISOString().split("T")[0],
//     entryNumber: "", // <-- new
//     item: {
//       entryNumber: "", // <-- new
//       partyNo: "", // <-- Add this line
//       productId: "",
//       companyId: "",
//       purchaseRate: "",
//       quantity: "",
//       availableQty: "",
//       totalAmount: "",
//       discountPercent: "0", // 🔄 NEW
//       schemePercent: "0", // 🔄 NEW
//     },
//   });

//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   const [itemsList, setItemsList] = useState([]);

//   const fetchInitialData = async () => {
//     setLoading(true);
//     try {
//       const [vRes, cRes, pRes, purRes] = await Promise.all([
//         axios.get("/vendor"),
//         axios.get("/company"),
//         axios.get("/product"),
//         axios.get("/purchase"),
//       ]);
//       setVendors(vRes.data);
//       setCompanies(cRes.data);
//       setProducts(pRes.data || []);
//       setPurchases(purRes.data || []);

//       setPurchaseData((prev) => ({
//         ...prev,
//       }));
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEntryNumber = async () => {
//     try {
//       const res = await axios.get("/purchase/next-entry-number");
//       setPurchaseData((prev) => ({
//         ...prev,
//         entryNumber: res.data.nextEntryNumber,
//       }));
//     } catch (err) {
//       console.error("Failed to fetch entry number:", err);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//     fetchEntryNumber();
//   }, []);

//   const handleItemChange = (e) => {
//     const { name, value } = e.target;

//     setPurchaseData((prev) => {
//       const updatedItem = { ...prev.item, [name]: value };

//       if (name === "productId") {
//         const selectedProduct = products.find((p) => p._id === value);
//         if (selectedProduct) {
//           updatedItem.availableQty = selectedProduct.availableQty;
//           updatedItem.purchaseRate = selectedProduct.purchaseRate;
//           updatedItem.quantity = "";
//           updatedItem.totalAmount = "";
//           updatedItem.discountPercent = "";
//           updatedItem.schemePercent = "";
//         }
//       }

//       const rate =
//         parseFloat(
//           name === "purchaseRate" ? value : updatedItem.purchaseRate
//         ) || 0;

//       const qty =
//         parseFloat(name === "quantity" ? value : updatedItem.quantity) || 0;

//       const dis =
//         parseFloat(
//           name === "discountPercent" ? value : updatedItem.discountPercent
//         ) || 0;

//       const scm =
//         parseFloat(
//           name === "schemePercent" ? value : updatedItem.schemePercent
//         ) || 0;

//       if (rate && qty) {
//         // ✅ Successive discount application
//         const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
//         const totalAmount = finalRate * qty;

//         updatedItem.totalAmount = totalAmount.toFixed(2);
//       }

//       return { ...prev, item: updatedItem };
//     });
//   };

//   const addItemToList = () => {
//     const item = purchaseData.item;

//     if (
//       !item.productId ||
//       !item.companyId ||
//       !item.quantity ||
//       !item.purchaseRate
//     ) {
//       alert("Please fill all required item fields");
//       return;
//     }

//     if (editItemIndex !== null) {
//       // 🛠️ Update existing item
//       const updatedItems = [...itemsList];
//       updatedItems[editItemIndex] = { ...item };
//       setItemsList(updatedItems);
//       setEditItemIndex(null);
//     } else {
//       // ➕ Add new item
//       setItemsList((prev) => [...prev, item]);
//     }

//     // Reset item form
//     setPurchaseData((prev) => ({
//       ...prev,
//       item: {
//         productId: "",
//         companyId: "",
//         quantity: "",
//         availableQty: "",
//         purchaseRate: "",
//         discountPercent: "",
//         schemePercent: "",
//         totalAmount: "",
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!purchaseData.vendorId || itemsList.length === 0) {
//       toast.error("Please select a vendor and add at least one item");
//       return;
//     }
//     setLoading(true);

//     try {
//       const dataToSend = {
//         vendorId: purchaseData.vendorId,
//         date: purchaseData.date, // include this
//         partyNo: purchaseData.partyNo,
//         entryNumber: purchaseData.entryNumber, // 🔄 SEND backend-generated entry number
//         items: itemsList,
//       };

//       if (editingId) {
//         await axios.put(`/purchase/${editingId}`, dataToSend);
//         toast.success("Purchase updated successfully");
//       } else {
//         await axios.post("/purchase", dataToSend);
//         fetchInitialData(); // 🔄 Refresh list after adding
//         fetchEntryNumber(); // 🔄 Get next entry number for next purchase
//         toast.success("Purchase saved successfully");
//       }

//       setPurchaseData({
//         vendorId: "",
//         date: getCurrentDate(), // ✅ Maintain current date
//         item: {
//           productId: "",
//           companyId: "",
//           purchaseRate: "",
//           quantity: "",
//           availableQty: "",
//           totalAmount: "",
//         },
//       });
//       setItemsList([]);
//       setEditingId(null);
//       fetchInitialData();
//     } catch (err) {
//       if (
//         err?.response?.data?.error ===
//         "Purchase validation failed: partyNo: Path `partyNo` is required."
//       ) {
//         return toast.error("Part No. is required");
//       }

//       toast.error(
//         err?.response?.data?.error || "Failed to save/update purchase"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     confirmAlert({
//       title: "Confirm Delete",
//       message: "Are you sure you want to delete this purchase?",
//       buttons: [
//         {
//           label: "Yes",
//           onClick: async () => {
//             try {
//               setLoading(true);
//               await axios.delete(`/purchase/${id}`);
//               toast.success("Purchase deleted");
//               fetchInitialData();
//             } catch (err) {
//               toast.error("Failed to delete purchase");
//             } finally {
//               setLoading(false);
//             }
//           },
//         },
//         {
//           label: "No",
//           onClick: () => {
//             // do nothing
//           },
//         },
//       ],
//     });
//   };

//   const removeItem = (index) => {
//     setItemsList((prev) => prev.filter((_, i) => i !== index));
//   };
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent form submission on Enter
//       console.log(e);
//       addItemToList();
//     }
//   };

//   // !EDIT EDIT EDIT.

//   // useEffect(() => {
//   //   const handleKeyDown = (e) => {
//   //     if (e.key === "F3") {
//   //       e.preventDefault();
//   //       const selectedProduct = products.find(
//   //         (p) => p._id === purchaseData.item.productId
//   //       );
//   //       if (selectedProduct) {
//   //         setEditedProductName(selectedProduct.productName);
//   //         setIsEditingProductName(true);
//   //       }
//   //     }
//   //   };

//   //   window.addEventListener("keydown", handleKeyDown);
//   //   return () => window.removeEventListener("keydown", handleKeyDown);
//   // }, [purchaseData.item.productId, products]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "F3") {
//         e.preventDefault();
//         const selectedProduct = products.find(
//           (p) => p._id === purchaseData.item.productId
//         );
//         if (selectedProduct) {
//           setSelectedProductToEdit(selectedProduct); // 👈 set the whole product
//           setShowProductModal(true); // 👈 open modal
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [purchaseData.item.productId, products]);

//   // !ESC
//   useEffect(() => {
//     const handleEscapeKey = (e) => {
//       if (e.key === "Escape") {
//         setEditItemIndex(null); // ✅ exit edit mode
//         setPurchaseData((prev) => ({
//           ...prev,
//           item: {
//             companyId: "",
//             productId: "",
//             quantity: 0,
//             availableQty: 0,
//             purchaseRate: 0,
//             discountPercent: 0,
//             schemePercent: 0,
//             totalAmount: 0,
//           },
//         }));
//       }
//     };

//     window.addEventListener("keydown", handleEscapeKey);

//     return () => {
//       window.removeEventListener("keydown", handleEscapeKey);
//     };
//   }, []);

//   const handleSaveEditedName = async () => {
//     const productId = purchaseData.item.productId;
//     try {
//       await axiosInstance.put(`/product/${productId}`, {
//         productName: editedProductName,
//       });

//       // Optionally update product list in frontend too
//       const updatedProducts = products.map((p) =>
//         p._id === productId ? { ...p, productName: editedProductName } : p
//       );
//       setProducts(updatedProducts);

//       setIsEditingProductName(false);
//     } catch (err) {
//       console.error("Error updating product name:", err);
//       alert("Failed to update product name.");
//       setIsEditingProductName(false);
//     }
//   };

//   const handleEditItem = (index) => {
//     const itemToEdit = itemsList[index];
//     setPurchaseData((prev) => ({
//       ...prev,
//       item: { ...itemToEdit },
//     }));
//     setEditItemIndex(index); // mark the index being edited
//   };

//   const handleEditPurchase = (purchase) => {
//     setPurchaseData({
//       entryNumber: purchase.entryNumber,
//       partyNo: purchase.partyNo,
//       vendorId: purchase.vendorId?._id || "",
//       date: dayjs(purchase.date).format("YYYY-MM-DD"),
//       item: {
//         productId: "",
//         quantity: "",
//         purchaseRate: "",
//         totalAmount: "",
//       },
//     });

//     setItemsList(purchase.items); // prefill item list
//     setEditPurchaseId(purchase._id); // Track purchase being edited
//   };

//   const handlePurchaseUpdate = async () => {
//     try {
//       const payload = {
//         entryNumber: purchaseData.entryNumber,
//         partyNo: purchaseData.partyNo,
//         vendorId: purchaseData.vendorId,
//         date: purchaseData.date,
//         items: itemsList,
//       };

//       const res = await axios.put(`/api/purchases/${editPurchaseId}`, payload);
//       toast.success("Purchase updated successfully!");
//       setEditPurchaseId(null);
//       fetchPurchases(); // refetch
//     } catch (error) {
//       toast.error("Failed to update purchase");
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className='mx-5'>
//       <Card className='p-4 mb-4'>
//         <h4 className='mb-3'>{editingId ? "Edit Purchase" : "Add Purchase"}</h4>
//         <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
//           {/* Vendor and Date */}
//           <Row className='mb-3 d-flex justify-content-between align-items-end'>
//             <Col xs={12} sm={6} md={3}>
//               <Form.Group>
//                 <Form.Label>Vendor</Form.Label>
//                 <Form.Select
//                   name='vendorId'
//                   value={purchaseData.vendorId}
//                   required
//                   onChange={(e) =>
//                     setPurchaseData((prev) => ({
//                       ...prev,
//                       vendorId: e.target.value,
//                     }))
//                   }
//                 >
//                   <option value=''>Select Vendor</option>
//                   {vendors.map((v) => (
//                     <option key={v._id} value={v._id}>
//                       {v.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>

//             <Col xs={12} sm={6} md={2} className='text-end'>
//               <Form.Group>
//                 <Form.Label>Purchase Date</Form.Label>
//                 <Form.Control
//                   type='date'
//                   name='date'
//                   value={purchaseData.date}
//                   onChange={(e) =>
//                     setPurchaseData((prev) => ({
//                       ...prev,
//                       date: e.target.value,
//                     }))
//                   }
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Entry No. and Party No. */}
//           <Row className='mb-3 d-flex justify-content-between align-items-end'>
//             <Col xs='auto'>
//               <Form.Group>
//                 <Form.Label>Entry No.</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='entryNumber'
//                   value={purchaseData.entryNumber}
//                   readOnly
//                   style={{ minWidth: "100px" }}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Party No.</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='partyNo'
//                   value={purchaseData.partyNo}
//                   required
//                   onChange={(e) =>
//                     setPurchaseData((prev) => ({
//                       ...prev,
//                       partyNo: e.target.value,
//                     }))
//                   }
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Buttons */}
//           <Row className='mt-3 d-flex align-items-center justify-content-between flex-wrap'>
//             <Col xs={12} md='auto' className='mb-2'>
//               <div style={{ fontSize: "12px", color: "gray" }}>
//                 <span className='me-3'>
//                   Press <kbd>Enter</kbd> to add items
//                 </span>
//                 <span className='me-3'>
//                   Press <kbd>F3</kbd> to edit product
//                 </span>
//                 <span>
//                   Press <kbd>Esc</kbd> to cancel edit
//                 </span>
//               </div>
//             </Col>

//             <Col
//               xs={12}
//               md='auto'
//               className='d-flex justify-content-end gap-2 mb-2'
//             >
//               <Button variant='primary' onClick={handleOpenProductModal}>
//                 <BsPlusCircle size={16} style={{ marginRight: "4px" }} />{" "}
//                 Product
//               </Button>
//               <Button variant='primary' onClick={addItemToList}>
//                 <MdOutlineKeyboardHide
//                   size={16}
//                   style={{ marginRight: "4px" }}
//                 />{" "}
//                 Add
//               </Button>
//             </Col>
//           </Row>

//           {/* Form */}
//           <div style={{ overflowX: "auto" }}>
//             <Row className='mb-3 flex-nowrap'>
//               <Col md='auto'>
//                 <Form.Group>
//                   <Form.Label>Brand</Form.Label>
//                   <Form.Select
//                     name='companyId'
//                     value={purchaseData.item.companyId}
//                     onChange={handleItemChange}
//                   >
//                     <option value=''>Select Company</option>
//                     {companies.map((c) => (
//                       <option key={c._id} value={c._id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md='auto'>
//                 <Form.Group>
//                   <Form.Label>Product</Form.Label>
//                   {isEditingProductName ? (
//                     <input
//                       type='text'
//                       value={editedProductName}
//                       onChange={(e) => setEditedProductName(e.target.value)}
//                       onBlur={handleSaveEditedName}
//                       autoFocus
//                       className='form-select'
//                     />
//                   ) : (
//                     <Form.Select
//                       name='productId'
//                       value={purchaseData.item.productId}
//                       onChange={handleItemChange}
//                     >
//                       <option value=''>Select Product</option>
//                       {products.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.productName}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   )}
//                 </Form.Group>
//               </Col>
//               {[
//                 { label: "Qty", name: "quantity" },
//                 {
//                   label: "Available Qty",
//                   name: "availableQty",
//                   readOnly: true,
//                 },
//                 { label: "Rate", name: "purchaseRate" },
//                 { label: "DIS%", name: "discountPercent" },
//                 { label: "SCM%", name: "schemePercent" },
//                 { label: "Total", name: "totalAmount", readOnly: true },
//               ].map(({ label, name, readOnly = false }) => (
//                 <Col key={name} md='auto'>
//                   <Form.Group>
//                     <Form.Label>{label}</Form.Label>
//                     <Form.Control
//                       type='number'
//                       name={name}
//                       value={purchaseData.item[name]}
//                       onChange={handleItemChange}
//                       onKeyDown={handleKeyDown}
//                       placeholder={`Enter ${label}`}
//                       readOnly={readOnly}
//                       className='auto-width-input'
//                     />
//                   </Form.Group>
//                 </Col>
//               ))}
//             </Row>
//           </div>

//           {/* Items Table */}
//           {itemsList.length > 0 && (
//             <Table striped bordered className='mt-3'>
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Product</th>
//                   <th>Company</th>
//                   <th>Qty</th>
//                   <th>Rate</th>
//                   <th>DIS%</th>
//                   <th>SCM%</th>
//                   <th>Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {itemsList.map((item, index) => {
//                   const product = products.find(
//                     (p) => p._id === item.productId
//                   );
//                   const company = companies.find(
//                     (c) => c._id === item.companyId
//                   );

//                   return (
//                     <tr
//                       key={index}
//                       style={{
//                         backgroundColor:
//                           editItemIndex === index ? "#e6f7ff" : "transparent",
//                         transition: "background-color 0.3s ease",
//                       }}
//                     >
//                       <td>{index + 1}</td>
//                       <td>{product?.productName || ""}</td>
//                       <td>{company?.name || ""}</td>
//                       <td>{item.quantity || ""}</td>
//                       <td>{item.purchaseRate || ""}</td>
//                       <td>{item.discountPercent || ""}</td>
//                       <td>{item.schemePercent || ""}</td>
//                       <td>{item.totalAmount || ""}</td>
//                       <td>
//                         <Button
//                           variant='outline-danger'
//                           size='sm'
//                           onClick={() => removeItem(index)}
//                           className='me-2'
//                         >
//                           <BsTrash />
//                         </Button>
//                         <Button
//                           variant='outline-primary'
//                           size='sm'
//                           onClick={() => handleEditItem(index)}
//                         >
//                           <MdModeEdit />
//                         </Button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           )}

//           {/* Submit Button */}
//           <Button
//             variant='primary'
//             onClick={(e) => {
//               if (editItemIndex !== null) {
//                 e.preventDefault();
//                 addItemToList();
//               } else {
//                 handleSubmit(e);
//               }
//             }}
//             disabled={!purchaseData.vendorId || itemsList.length === 0}
//           >
//             {editItemIndex !== null ? "Update Item" : "Save Purchase"}
//           </Button>
//         </Form>
//       </Card>

//       {/* Purchase List */}
//       <Card className='p-3'>
//         <h5>Purchase List</h5>
//         <Table striped bordered>
//           <thead>
//             <tr>
//               <th>Entry No.</th>
//               <th>Party No.</th>
//               <th>Vendor</th>
//               <th>Items Count</th>
//               <th>Item Quantity</th>
//               <th>Item Rate</th>
//               <th>Total Amount</th>
//               <th>Purchase Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {purchases.map((p) => (
//               <React.Fragment key={p._id}>
//                 <tr>
//                   <td>{p.entryNumber}</td>
//                   <td>{p.partyNo}</td>
//                   <td>{p.vendorId?.name}</td>
//                   <td>{p.items.length}</td>
//                   <td>
//                     {p.items.map((i, idx) => (
//                       <div key={idx}>
//                         {i.productId?.productName}: {i.quantity}
//                       </div>
//                     ))}
//                   </td>
//                   <td>
//                     {p.items.map((i, idx) => (
//                       <div key={idx}>₹{i.purchaseRate}</div>
//                     ))}
//                   </td>
//                   <td>
//                     {p.items.map((i, idx) => (
//                       <div key={idx}>₹{i.totalAmount}</div>
//                     ))}
//                   </td>
//                   <td>{dayjs(p.date).format("DD MMM YYYY")}</td>
//                   <td className='d-flex gap-2'>
//                     <Button
//                       variant='warning'
//                       size='sm'
//                       onClick={() => handleEditPurchase(p)}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant='danger'
//                       size='sm'
//                       onClick={() => handleDelete(p._id)}
//                     >
//                       <BsTrash />
//                     </Button>
//                   </td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </Table>
//       </Card>

//       {/* Product Modal */}
//       <Modal
//         show={showProductModal}
//         onHide={() => {
//           setSelectedProductToEdit(null);
//           handleCloseProductModal();
//         }}
//         size='lg'
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedProductToEdit ? "Edit Product" : "Add New Product"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Product
//             onSuccess={() => {
//               handleCloseProductModal();
//               setSelectedProductToEdit(null);
//               fetchInitialData();
//             }}
//             onCancel={() => {
//               handleCloseProductModal();
//               setSelectedProductToEdit(null);
//             }}
//             productToEdit={selectedProductToEdit}
//           />
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };
// export default PurchaseForm;

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

import { MdModeEdit, MdOutlineKeyboardHide } from "react-icons/md";

import { confirmAlert } from "react-confirm-alert";
import Product from "../Productss/CreateProduct/Product";
import axiosInstance from "../../Config/axios";
import dayjs from "dayjs";

const PurchaseForm = () => {
  const [vendors, setVendors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [editingId, setEditingId] = useState(null); // This needs to be set for main purchase edit
  const [loading, setLoading] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);

  const [isEditingProductName, setIsEditingProductName] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");

  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);

  const [editItemIndex, setEditItemIndex] = useState(null);
  // const [editingPurchaseId, setEditingPurchaseId] = useState(null); // This state is not being used in your current logic for the overall purchase edit.
  // const [EditPurchaseId, setEditPurchaseId] = useState({}); // This was being used, but `editingId` is more appropriate for the main form.

  // ! edit options
  const handleOpenProductModal = () => {
    setSelectedProductToEdit(null); // ✅ Ensure it opens in ADD mode
    setShowProductModal(true);
  };
  const handleCloseProductModal = () => setShowProductModal(false);

  const [purchaseData, setPurchaseData] = useState({
    vendorId: "",
    date: new Date().toISOString().split("T")[0],
    entryNumber: "",
    partyNo: "", // Moved partyNo here as it's a main purchase field
    item: {
      productId: "",
      companyId: "",
      purchaseRate: "",
      quantity: "",
      availableQty: "",
      totalAmount: "",
      discountPercent: "0",
      schemePercent: "0",
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
        // No need to set purchaseData here with initial values, it's done in useState
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch initial data.");
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
      toast.error("Failed to fetch entry number.");
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
          updatedItem.discountPercent = "0"; // Reset to default "0"
          updatedItem.schemePercent = "0"; // Reset to default "0"
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
    const item = purchaseData.item;

    if (
      !item.productId ||
      !item.companyId ||
      !item.quantity ||
      !item.purchaseRate
    ) {
      toast.error(
        "Please fill all required item fields (Product, Brand, Qty, Rate)."
      );
      return;
    }

    if (editItemIndex !== null) {
      // 🛠️ Update existing item
      const updatedItems = [...itemsList];
      updatedItems[editItemIndex] = { ...item };
      setItemsList(updatedItems);
      setEditItemIndex(null);
    } else {
      // ➕ Add new item
      setItemsList((prev) => [...prev, item]);
    }

    // Reset item form
    setPurchaseData((prev) => ({
      ...prev,
      item: {
        productId: "",
        companyId: "",
        quantity: "",
        availableQty: "",
        purchaseRate: "",
        discountPercent: "0", // Reset to default "0"
        schemePercent: "0", // Reset to default "0"
        totalAmount: "",
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purchaseData.vendorId || itemsList.length === 0) {
      toast.error("Please select a vendor and add at least one item.");
      return;
    }
    if (!purchaseData.partyNo) {
      // Added validation for partyNo
      toast.error("Party No. is required.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        vendorId: purchaseData.vendorId,
        date: purchaseData.date,
        partyNo: purchaseData.partyNo,
        entryNumber: purchaseData.entryNumber,
        items: itemsList,
      };

      if (editingId) {
        // This `editingId` will now be correctly set from handleEditPurchase
        await axios.put(`/purchase/${editingId}`, dataToSend);
        toast.success("Purchase updated successfully.");
      } else {
        await axios.post("/purchase", dataToSend);
        fetchEntryNumber(); // 🔄 Get next entry number for next purchase
        toast.success("Purchase saved successfully.");
      }

      // Reset form after submission (for both add and edit)
      setPurchaseData({
        vendorId: "",
        date: getCurrentDate(),
        entryNumber: "", // Will be refetched by fetchEntryNumber
        partyNo: "",
        item: {
          productId: "",
          companyId: "",
          purchaseRate: "",
          quantity: "",
          availableQty: "",
          totalAmount: "",
          discountPercent: "0",
          schemePercent: "0",
        },
      });
      setItemsList([]);
      setEditingId(null); // Clear editing ID
      fetchInitialData(); // Refresh the list of purchases
    } catch (err) {
      console.error("Error saving/updating purchase:", err);
      toast.error(
        err?.response?.data?.error || "Failed to save/update purchase."
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
              toast.success("Purchase deleted successfully.");
              fetchInitialData();
            } catch (err) {
              console.error("Error deleting purchase:", err);
              toast.error("Failed to delete purchase.");
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

  // const handleKeyDown = (e) => {
  //   // Only add item to list if the active element is an input within the item form
  //   // and not if the focus is on a button or select outside the item inputs.
  // if (e.key === "Enter" && e.target.closest(".flex-nowrap")) {
  //   e.preventDefault(); // Prevent form submission on Enter
  //   addItemToList();
  // }
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault(); // Prevent form submit on Enter

  //     const form = e.target.form;
  //     const index = Array.prototype.indexOf.call(form, e.target);

  //     // Check if inside the specific row (e.g., .flex-nowrap)
  //     const isInsideRow = e.target.closest(".flex-nowrap");

  //     if (!form || !isInsideRow) return;

  //     // If it's the last input in the row, call addItemToList()
  //     if (
  //       index === form.length - 1 ||
  //       form.elements[index + 1].closest(".flex-nowrap") !== isInsideRow
  //     ) {
  //       addItemToList();
  //     } else {
  //       // Move to next input in same row
  //       let nextInput = form.elements[index + 1];

  //       // Skip hidden/disabled fields
  //       while (
  //         nextInput &&
  //         (nextInput.type === "hidden" || nextInput.disabled)
  //       ) {
  //         nextInput = form.elements[++index + 1];
  //       }

  //       if (nextInput) nextInput.focus();
  //     }
  //   }
  // };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const form = e.target.form;
      const inputs = Array.from(form.elements).filter(
        (el) =>
          el.tagName === "INPUT" ||
          el.tagName === "SELECT" ||
          el.tagName === "TEXTAREA"
      );

      const index = inputs.indexOf(e.target);

      const isInsideRow = e.target.closest(".flex-nowrap");

      if (!form || !isInsideRow) return;

      const isLastInput =
        index === inputs.length - 1 ||
        inputs[index + 1]?.closest(".flex-nowrap") !== isInsideRow;

      if (isLastInput) {
        // Action on last input
        addItemToList();

        // Focus back to first input in the same row
        const firstInput = inputs.find(
          (el) => el.closest(".flex-nowrap") === isInsideRow
        );
        if (firstInput) firstInput.focus();
      } else {
        // Move to next input
        let nextInput = inputs[index + 1];
        while (
          nextInput &&
          (nextInput.disabled || nextInput.type === "hidden")
        ) {
          nextInput = inputs[++index + 1];
        }
        if (nextInput) nextInput.focus();
      }
    }
  };

  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.key === "F3") {
        e.preventDefault();
        const selectedProduct = products.find(
          (p) => p._id === purchaseData.item.productId
        );
        if (selectedProduct) {
          setSelectedProductToEdit(selectedProduct);
          setShowProductModal(true);
        } else {
          // If no product is selected in the dropdown, open the modal for adding a new product
          setSelectedProductToEdit(null);
          setShowProductModal(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDownGlobal);
    return () => window.removeEventListener("keydown", handleKeyDownGlobal);
  }, [purchaseData.item.productId, products]);

  // !ESC
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setEditItemIndex(null); // ✅ exit edit mode for item
        setPurchaseData((prev) => ({
          ...prev,
          item: {
            productId: "",
            companyId: "",
            quantity: "",
            availableQty: "",
            purchaseRate: "",
            discountPercent: "0",
            schemePercent: "0",
            totalAmount: "",
          },
        }));
        setEditingId(null); // ✅ exit edit mode for main purchase form
        // Also reset main form fields when escaping from a purchase edit
        setPurchaseData((prev) => ({
          ...prev,
          vendorId: "",
          date: getCurrentDate(),
          entryNumber: "", // Will be refetched
          partyNo: "",
        }));
        setItemsList([]); // Clear items list
        fetchEntryNumber(); // Fetch a new entry number
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleSaveEditedName = async () => {
    const productId = purchaseData.item.productId;
    if (!productId || !editedProductName) {
      toast.error("Please select a product and enter a name.");
      setIsEditingProductName(false);
      return;
    }
    try {
      await axiosInstance.put(`/product/${productId}`, {
        productName: editedProductName,
      });

      const updatedProducts = products.map((p) =>
        p._id === productId ? { ...p, productName: editedProductName } : p
      );
      setProducts(updatedProducts);
      toast.success("Product name updated successfully!");
      setIsEditingProductName(false);
    } catch (err) {
      console.error("Error updating product name:", err);
      toast.error("Failed to update product name.");
      setIsEditingProductName(false);
    }
  };

  const handleEditItem = (index) => {
    const itemToEdit = itemsList[index];
    setPurchaseData((prev) => ({
      ...prev,
      item: { ...itemToEdit },
    }));
    setEditItemIndex(index); // mark the index being edited
  };

  const handleEditPurchase = (purchase) => {
    // Set the main purchase form fields for editing
    setPurchaseData({
      entryNumber: purchase.entryNumber,
      partyNo: purchase.partyNo,
      vendorId: purchase.vendorId?._id || "",
      date: dayjs(purchase.date).format("YYYY-MM-DD"),
      item: {
        // Reset item fields when loading a new purchase for editing
        productId: "",
        quantity: "",
        purchaseRate: "",
        availableQty: "",
        totalAmount: "",
        discountPercent: "0",
        schemePercent: "0",
      },
    });

    // Prefill the items list with the purchase's existing items
    setItemsList(
      purchase.items.map((item) => ({
        ...item,
        productId: item.productId._id, // Ensure it's just the ID
        companyId: item.companyId._id, // Ensure it's just the ID
      }))
    );
    setEditingId(purchase._id); // ✅ THIS IS CRUCIAL: Set the ID of the purchase being edited
    setEditItemIndex(null); // Ensure no individual item is in edit mode when starting a purchase edit
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='mx-5'>
      <Card className='p-4 mb-4'>
        <h4 className='mb-3'>{editingId ? "Edit Purchase" : "Add Purchase"}</h4>
        <Form onSubmit={handleSubmit}>
          {" "}
          {/* Removed onKeyDown from Form directly */}
          {/* Vendor and Date */}
          <Row className='mb-3 d-flex justify-content-between align-items-end'>
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Label>Vendor</Form.Label>
                <Form.Select
                  name='vendorId'
                  value={purchaseData.vendorId}
                  required
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
          {/* Entry No. and Party No. */}
          <Row className='mb-3 d-flex justify-content-between align-items-end'>
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
                  required
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
          {/* Buttons */}
          <Row className='mt-3 d-flex align-items-center justify-content-between flex-wrap'>
            <Col xs={12} md='auto' className='mb-2'>
              <div style={{ fontSize: "12px", color: "gray" }}>
                <span className='me-3'>
                  Press <kbd>Enter</kbd> to add items
                </span>
                <span className='me-3'>
                  Press <kbd>F3</kbd> to edit product
                </span>
                <span>
                  Press <kbd>Esc</kbd> to cancel edit
                </span>
              </div>
            </Col>

            <Col
              xs={12}
              md='auto'
              className='d-flex justify-content-end gap-2 mb-2'
            >
              <Button variant='primary' onClick={handleOpenProductModal}>
                <BsPlusCircle size={16} style={{ marginRight: "4px" }} />{" "}
                Product
              </Button>
              <Button variant='primary' onClick={addItemToList}>
                <MdOutlineKeyboardHide
                  size={16}
                  style={{ marginRight: "4px" }}
                />{" "}
                {editItemIndex !== null ? "Update Item" : "Add Item"}{" "}
                {/* Changed button text */}
              </Button>
            </Col>
          </Row>
          {/* Item Form */}
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
                  {isEditingProductName ? (
                    <input
                      type='text'
                      value={editedProductName}
                      onChange={(e) => setEditedProductName(e.target.value)}
                      onBlur={handleSaveEditedName}
                      autoFocus
                      className='form-select'
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
          {/* Items Table */}
          {itemsList.length > 0 && (
            <Table striped bordered className='mt-3'>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product</th>
                  <th>Company</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>DIS%</th>
                  <th>SCM%</th>
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
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          editItemIndex === index ? "#e6f7ff" : "transparent",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{product?.productName || ""}</td>
                      <td>{company?.name || ""}</td>
                      <td>{item.quantity || ""}</td>
                      <td>{item.purchaseRate || ""}</td>
                      <td>{item.discountPercent || ""}</td>
                      <td>{item.schemePercent || ""}</td>
                      <td>{item.totalAmount || ""}</td>
                      <td>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => removeItem(index)}
                          className='me-2'
                        >
                          <BsTrash />
                        </Button>
                        <Button
                          variant='outline-primary'
                          size='sm'
                          onClick={() => handleEditItem(index)}
                        >
                          <MdModeEdit />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          {/* Submit Button */}
          <Button
            variant='primary'
            type='submit' // Changed to type='submit'
            // onClick handler removed as the button is type submit and form has onSubmit
            className='mt-3'
            disabled={!purchaseData.vendorId || itemsList.length === 0}
          >
            {editingId ? "Update Purchase" : "Save Purchase"}{" "}
            {/* Changed button text */}
          </Button>
        </Form>
      </Card>

      {/* Purchase List */}
      <Card className='p-3 mt-4'>
        {" "}
        {/* Added mt-4 for spacing */}
        <h5>Purchase List</h5>
        {purchases.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          <Table striped bordered responsive>
            {" "}
            {/* Added responsive for better mobile view */}
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
              {purchases.map((p) => (
                <tr key={p._id}>
                  <td>{p.entryNumber}</td>
                  <td>{p.partyNo}</td>
                  <td>{p.vendorId?.name}</td>
                  <td>{p.items.length}</td>
                  <td>
                    {p.items.map((i, idx) => (
                      <div key={idx}>
                        {i.productId?.productName}: {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    {p.items.map((i, idx) => (
                      <div key={idx}>₹{i.purchaseRate}</div>
                    ))}
                  </td>
                  <td>
                    {p.items.map((i, idx) => (
                      <div key={idx}>₹{i.totalAmount}</div>
                    ))}
                  </td>
                  <td>{dayjs(p.date).format("DD MMM YYYY")}</td>
                  <td className='d-flex gap-2'>
                    <Button
                      variant='warning'
                      size='sm'
                      onClick={() => handleEditPurchase(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => handleDelete(p._id)}
                    >
                      <BsTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Product Modal */}
      <Modal
        show={showProductModal}
        onHide={() => {
          setSelectedProductToEdit(null);
          handleCloseProductModal();
        }}
        size='lg'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProductToEdit ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Product
            onSuccess={() => {
              handleCloseProductModal();
              setSelectedProductToEdit(null);
              fetchInitialData();
            }}
            onCancel={() => {
              handleCloseProductModal();
              setSelectedProductToEdit(null);
            }}
            productToEdit={selectedProductToEdit}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default PurchaseForm;
