import React, { useEffect, useState } from "react";
import { Container, Card, Tabs, Tab, Table, Button } from "react-bootstrap";
import axios from "../../Config/axios";
import AddCustomer from "./AddCustomer";
import { ToastContainer, toast } from "react-toastify";

function CustomerDetail() {
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/customer");
      setCustomers(res.data);
    } catch (err) {
      // toast.error("Failed to fetch customers");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/customer/${id}`);
      setCustomers(customers.filter((cust) => cust._id !== id));
      toast.success("Customer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error(error);
    }
  };
  // Add this to CustomerDetail.js
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setActiveTab("add"); // Switch to "Add Customer" tab
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              if (k === "details") fetchCustomers();
            }}
            className="mb-3"
          >
            <Tab eventKey="details" title="Customer Detail">
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Firm Name</th>
                    <th>Contract Person</th>
                    <th>Credit Limit</th>
                    <th>Credit Day</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((cust, index) => (
                    <tr key={cust._id}>
                      <td>{index + 1}</td>
                      <td>{cust.firm || "N/A"}</td>
                      <td>{cust.name}</td>
                      <td>{cust.creditLimit}</td>
                      <td>{new Date(cust.creditDay).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(cust)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(cust._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="add" title="Add Customer">
              <AddCustomer
                refresh={fetchCustomers}
                editingCustomer={editingCustomer}
                setEditingCustomer={setEditingCustomer}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default CustomerDetail;
