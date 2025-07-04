import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import axios from "../../../Config/axios";
const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");
import Image from "react-bootstrap/Image";
import Loader from "../../Loader";
import toast from "react-hot-toast";
import CustomDataTable from "../../CustomDataTable";

const ProductList = ({ onEdit, refreshFlag }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

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
    fetchProducts();
  }, [refreshFlag]);

  const handleEdit = (index) => {
    const selectedProduct = products[index];
    if (onEdit) {
      onEdit(selectedProduct);
    }
  };

  const handleDelete = async (index) => {
    const productToDelete = products[index];
    if (!productToDelete?._id) return;

    try {
      setLoading(true);
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

  const productColumns = [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Product Image",
      selector: (row) =>
        row.productImg ? (
          <Image
            src={`${IMAGE_BASE}/Images/${row.productImg}`}
            roundedCircle
            width={40}
            height={40}
          />
        ) : (
          "No Photo"
        ),
      sortable: false,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.companyId?.name || "-",
      sortable: true,
    },
    {
      name: "HSN Code",
      selector: (row) => row.hsnCode,
      sortable: true,
    },
    {
      name: "MRP",
      selector: (row) => row.mrp,
      sortable: true,
    },
    {
      name: "Sales Rate",
      selector: (row) => row.salesRate,
      sortable: true,
    },
    {
      name: "Purchase Rate",
      selector: (row) => row.purchaseRate,
      sortable: true,
    },
    {
      name: "Available Qty",
      selector: (row) => row.availableQty,
      sortable: true,
    },
    {
      name: "GST %",
      selector: (row) => row.gstPercent,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <>
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
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className='col-md-12 mb-4'>
      <div className='card shadow border-0'>
        <div className='card-body'>
          <h5 className='card-title text-success mb-3'>Product List</h5>
          {products.length === 0 ? (
            <p>No products added yet.</p>
          ) : (
            <CustomDataTable
              title='Product Table'
              columns={productColumns}
              data={products}
              pagination={true}
              loading={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
