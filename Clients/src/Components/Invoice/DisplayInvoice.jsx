import React, { useEffect, useState } from "react";
import axios from "../../Config/axios";
import { Table, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DisplayInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("/pro-billing");
      setInvoices(response.data);
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error("Failed to fetch invoices:", error);
    }
  };

  const handlePrint = (invoiceId) => {
    navigate(`/generate-invoice/${invoiceId}`);
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    try {
      await axios.delete(`/pro-billing/${invoiceId}`);
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to delete invoice");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className='w-full mt-4 px-3'>
      <h2 className='mb-4'>All Invoices</h2>

      <div style={{ overflowX: "auto" }}>
        <Table
          striped
          bordered
          hover
          responsive
          style={{ tableLayout: "fixed", minWidth: "900px" }}
        >
          <thead className='bg-light sticky-top' style={{ top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ width: "120px" }}>Date</th>
              <th>Item Purchased</th>
              <th>Quantity</th>
              <th>Free</th>
              <th>Total Qty</th>
              <th>Total Price</th>
              <th>Print</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => {
              const { customer = {}, billing = [] } = invoice;

              return (
                <tr key={invoice._id}>
                  <td>
                    {customer.Billdate
                      ? new Date(customer.Billdate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {item.itemName || "-"}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {item.qty || 0} {item.unit || ""}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {item.Free || 0}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {(item.qty || 0) + (item.Free || 0)}
                        <br />
                      </div>
                    ))}
                  </td>

                  <td>{invoice.finalAmount || 0}</td>

                  <td>
                    <Button
                      variant='outline-primary'
                      size='sm'
                      onClick={() => handlePrint(invoice._id)}
                    >
                      Print
                    </Button>
                  </td>

                  <td>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      onClick={() => handleDelete(invoice._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  );
};

export default DisplayInvoice;
