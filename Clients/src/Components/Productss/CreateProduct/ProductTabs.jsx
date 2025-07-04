import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const ProductTabs = () => {
  const [key, setKey] = useState("form");
  const [productToEdit, setProductToEdit] = useState(null);
  const [refreshListFlag, setRefreshListFlag] = useState(0); // Trigger

  const handleEdit = (product) => {
    setProductToEdit(product);
    setKey("form"); // Switch to form tab
  };

  const handleSuccess = () => {
    setProductToEdit(null); // Reset edit mode
    setRefreshListFlag((prev) => prev + 1); // Change flag to trigger refresh
    setKey("list"); // Go back to list after success
  };

  return (
    <div className='container mt-3'>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className='mb-3'
        justify
      >
        <Tab
          eventKey='form'
          title={productToEdit ? "Edit Product" : "Add Product"}
        >
          <ProductForm
            onSuccess={handleSuccess}
            productToEdit={productToEdit}
          />
        </Tab>
        <Tab eventKey='list' title='Product List'>
          <ProductList onEdit={handleEdit} refreshFlag={refreshListFlag} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProductTabs;
