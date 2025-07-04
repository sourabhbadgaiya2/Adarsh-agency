import React from "react";
import { Button, Image } from "react-bootstrap";
import CustomDataTable from "../../../Components/CustomDataTable";
import { BsPencil, BsTrash2 } from "react-icons/bs";

const VendorList = ({ vendorList, handleEdit, handleDelete, loading }) => {
  const columns = [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      width: "70px",
      sortable: true, // ✅ add this
    },
    {
      name: "Firm",
      selector: (row) => row.firm,
      sortable: true, // ✅ add this
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true, // ✅ add this
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true, // ✅ add this
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true, // ✅ add this
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true, // ✅ add this
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button variant='warning' size='sm' onClick={() => handleEdit(row)}>
            <BsPencil />
          </Button>
          <Button
            variant='danger'
            size='sm'
            className='ms-2'
            onClick={() => handleDelete(row._id)}
          >
            <BsTrash2 />
          </Button>
        </>
      ),
    },
  ];

  return (
    <CustomDataTable
      title='Vendor List'
      columns={columns}
      data={vendorList}
      loading={loading}
      pagination={true}
    />
  );
};

export default VendorList;
