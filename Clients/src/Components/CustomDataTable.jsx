// import React from "react";
// import DataTable from "react-data-table-component";

// function CustomDataTable({
//   title,
//   columns,
//   data,
//   pagination = true,
//   filterComponent = null,
//   exportButtons = null,
//   loading = false,
// }) {
//   const paginationOptions = {
//     rowsPerPageText: "Rows per page:",
//     rangeSeparatorText: "of",
//     selectAllRowsItem: true,
//     selectAllRowsItemText: "All",
//   };

//   if (loading) {
//     return <div className='py-4 text-center'>Loading...</div>; // or your Loader component
//   }

//   return (
//     <div>
//       {filterComponent}
//       {exportButtons}

//       <DataTable
//         title={title}
//         columns={columns}
//         data={data}
//         pagination={pagination}
//         persistTableHead
//         responsive
//         striped
//         highlightOnHover
//         pointerOnHover
//         paginationComponentOptions={paginationOptions}
//         defaultSortFieldId={1}
//         defaultSortAsc={true}
//         noDataComponent={<div className='py-4'>No data found</div>}
//       />
//     </div>
//   );
// }

// export default CustomDataTable;

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { InputGroup, Form, Button } from "react-bootstrap";

function CustomDataTable({
  title = "",
  columns,
  data = [],
  pagination = true,
  exportButtons = null,
  loading = false,
}) {
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  // ✅ Filter Logic - basic substring match
  useEffect(() => {
    const lowerText = filterText.toLowerCase();

    const filtered = data.filter((item) =>
      Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerText);
        }
        return false;
      })
    );

    setFilteredData(filtered);
  }, [filterText, data]);

  if (loading) {
    return <div className='py-4 text-center'>Loading...</div>; // or your Loader component
  }

  return (
    <div>
      {/* ✅ Search Bar */}
      <InputGroup className='mb-3'>
        <Form.Control
          type='text'
          placeholder='Search...'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        {filterText && (
          <Button variant='outline-secondary' onClick={() => setFilterText("")}>
            Clear
          </Button>
        )}
      </InputGroup>

      {/* ✅ Export Buttons (optional) */}
      {exportButtons}

      {/* ✅ Table */}
      <DataTable
        title={title}
        columns={columns}
        data={filteredData}
        pagination={pagination}
        persistTableHead
        responsive
        striped
        highlightOnHover
        pointerOnHover
        paginationComponentOptions={paginationOptions}
        defaultSortFieldId={1}
        defaultSortAsc={true}
        noDataComponent={<div className='py-4'>No data found</div>}
      />
    </div>
  );
}

export default CustomDataTable;
