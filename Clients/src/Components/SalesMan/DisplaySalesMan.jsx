import React, { useEffect, useState } from "react";
import { Container, Table, Image, Button } from "react-bootstrap";
import axios from "../../Config/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API;
const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");

function DisplaySalesMan() {
  const [salesmen, setSalesmen] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSalesmen = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/salesman");
      setSalesmen(response.data);
    } catch (error) {
      console.error("Error fetching salesmen:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/add-salesman/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this salesman?")) {
      try {
        setLoading(true);
        await axios.delete(`/salesman/${id}`);
        fetchSalesmen(); // Refresh the list
        toast.success("Delete Successfully");
      } catch (error) {
        console.error("Error deleting salesman:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className='my-4'>
      <h3>Salesman List</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Alternate Mobile</th>
            <th>Beat</th>
            <th>City</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {salesmen &&
            salesmen.Data.map((s) => (
              <tr key={s._id}>
                <td>
                  {s.photo ? (
                    <Image
                      src={`${IMAGE_BASE}/Images/${s.photo}`}
                      roundedCircle
                      width={50}
                      height={50}
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
                <td>{s.name}</td>
                <td>{s.mobile}</td>
                <td>{s.alternateMobile}</td>
                <td>
                  <div className='d-flex flex-column gap-2'>
                    {s.beat.map((b, i) => (
                      <span key={i} className='bg-light px-2 py-1 rounded'>
                        {b.area}
                      </span>
                    ))}
                  </div>
                </td>

                <td>{s.city}</td>
                <td>{s.username}</td>
                <td>
                  <div className='btn-group' role='group'>
                    <Button
                      variant='link'
                      className='text-primary'
                      onClick={() => handleEdit(s._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='link'
                      className='text-danger'
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default DisplaySalesMan;
