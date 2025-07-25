// import React from "react";
// import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import {
//   FiGrid,
//   FiLayers,
//   FiUsers,
//   FiUser,
//   FiBriefcase,
//   FiHome,
//   FiMessageSquare,
//   FiCheckSquare,
//   FiFileText,
//   FiChevronDown,
//   FiMenu,
// } from "react-icons/fi";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Navbarfristn = () => {
//   const dropdownItems = {
//     masters: [
//       { name: "Sub Master 1", to: "/composite" },
//       { name: "Sub Master 2", to: "/masters/sub-master2" },
//       { name: "Sub Master 3", to: "/masters/sub-master3" },
//       { name: "All Masters", to: "/masters/all-masters", divider: true },
//     ],
//     customers: [
//       { name: "Customer List", to: "/customers/list" },
//       { name: "Add Customer", to: "/customers/add" },
//       { name: "Customer Groups", to: "/customers/groups" },
//     ],
//   };

//   return (
//     <div className='vpfinancial-navbar'>
//       <div className='blue-header'>
//         <Container>
//           <h1 className='brand-title'>Adarsh Agency</h1>
//         </Container>
//       </div>

//       <div className='dashboard-section'>
//         <Container>
//           <div className='dashboard-header'>
//             <h2 className='dashboard-title'>Dashboard</h2>
//             <div className='breadcrumb'>Lexa &gt; Dashboard</div>
//           </div>
//         </Container>
//       </div>

//       <Navbar bg='white' expand='lg' className='main-navigation'>
//         <Container fluid>
//           <Navbar.Toggle
//             aria-controls='main-navbar-nav'
//             className='navbar-toggler-custom'
//           >
//             <FiMenu className='toggle-icon' />
//           </Navbar.Toggle>

//           <Navbar.Collapse id='main-navbar-nav'>
//             <Nav className='mx-auto'>
//               <Nav.Link as={Link} to='/dashboard' className='nav-item'>
//                 <FiGrid className='nav-icon' />
//                 <span className='nav-text'>Dashboard</span>
//               </Nav.Link>

//               {/* Masters Dropdown */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link} className='nav-link'>
//                   <FiLayers className='nav-icon' />
//                   <span className='nav-text'>
//                     Masters{" "}
//                     <FiChevronDown
//                       size={12}
//                       className='ms-1 dropdown-chevron'
//                     />
//                   </span>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className='p-3' style={{ minWidth: "400px" }}>
//                   <div className='row'>
//                     {dropdownItems.masters.map((item, index) => (
//                       <div className='col-md-6' key={index}>
//                         <Dropdown.Item as={Link} to={item.to}>
//                           {item.name}
//                         </Dropdown.Item>
//                         {item.divider && <Dropdown.Divider />}
//                       </div>
//                     ))}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* Customers Dropdown */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link} className='nav-link'>
//                   <FiUsers className='nav-icon' />
//                   <span className='nav-text'>
//                     Customers{" "}
//                     <FiChevronDown
//                       size={12}
//                       className='ms-1 dropdown-chevron'
//                     />
//                   </span>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className='p-3' style={{ minWidth: "400px" }}>
//                   <div className='row'>
//                     {dropdownItems.customers.map((item, index) => (
//                       <div className='col-md-6' key={index}>
//                         <Dropdown.Item as={Link} to={item.to}>
//                           {item.name}
//                         </Dropdown.Item>
//                       </div>
//                     ))}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* Employee Dropdown */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link} className='nav-link'>
//                   <FiUser className='nav-icon' />
//                   <span className='nav-text'>
//                     Employee{" "}
//                     <FiChevronDown
//                       size={12}
//                       className='ms-1 dropdown-chevron'
//                     />
//                   </span>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className='p-3' style={{ minWidth: "400px" }}>
//                   <div className='row'>
//                     {dropdownItems.employee.map((item, index) => (
//                       <div className='col-md-6' key={index}>
//                         <Dropdown.Item as={Link} to={item.to}>
//                           {item.name}
//                         </Dropdown.Item>
//                       </div>
//                     ))}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               <Nav.Link as={Link} to='/departments' className='nav-item'>
//                 <FiBriefcase className='nav-icon' />
//                 <span className='nav-text'>Departments</span>
//               </Nav.Link>

//               <Nav.Link as={Link} to='/office' className='nav-item'>
//                 <FiHome className='nav-icon' />
//                 <span className='nav-text'>Office</span>
//               </Nav.Link>

//               {/* CRM Dropdown */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link} className='nav-link'>
//                   <FiMessageSquare className='nav-icon' />
//                   <span className='nav-text'>
//                     CRM{" "}
//                     <FiChevronDown
//                       size={12}
//                       className='ms-1 dropdown-chevron'
//                     />
//                   </span>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className='p-3' style={{ minWidth: "400px" }}>
//                   <div className='row'>
//                     {dropdownItems.crm.map((item, index) => (
//                       <div className='col-md-6' key={index}>
//                         <Dropdown.Item as={Link} to={item.to}>
//                           {item.name}
//                         </Dropdown.Item>
//                       </div>
//                     ))}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               <Nav.Link as={Link} to='/task' className='nav-item'>
//                 <FiCheckSquare className='nav-icon' />
//                 <span className='nav-text'>Task</span>
//               </Nav.Link>

//               {/* Reports Dropdown */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link} className='nav-link'>
//                   <FiFileText className='nav-icon' />
//                   <span className='nav-text'>
//                     Reports{" "}
//                     <FiChevronDown
//                       size={12}
//                       className='ms-1 dropdown-chevron'
//                     />
//                   </span>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className='p-3' style={{ minWidth: "400px" }}>
//                   <div className='row'>
//                     {dropdownItems.reports.map((item, index) => (
//                       <div className='col-md-6' key={index}>
//                         <Dropdown.Item as={Link} to={item.to}>
//                           {item.name}
//                         </Dropdown.Item>
//                       </div>
//                     ))}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </div>
//   );
// };

// export default Navbarfristn;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiLayers, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbarfrist = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar closed by default
  const [openDropdown, setOpenDropdown] = useState("");
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (menu) =>
    setOpenDropdown((prev) => (prev === menu ? "" : menu));
  const closeSidebar = () => setIsOpen(false); // Close on link click
  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    backgroundColor: isActive(path) ? "#DC3545" : "transparent",
    borderRadius: "0.375rem",
    padding: "8px 12px",
    fontWeight: isActive(path) ? "bold" : "normal",
    display: "block",
    marginBottom: "4px",
    color: "#fff",
    textDecoration: "none",
  });

  return (
    <>
      {/* Toggle Button for All Screens */}
      <div
        className='position-fixed w-100 bg-white py-2  d-flex align-items-center justify-content-between top-0 mb-5 start-0 p-2 z-3'
        style={{ zIndex: 1050 }}
      >
        <div className='d-flex align-items-center justify-content-between'>
          {!isOpen && (
            <FiMenu
              className='text-dark fs-3'
              style={{ cursor: "pointer" }}
              onClick={toggleSidebar}
            />
          )}

          <h5 className='custom-logo mb-0'>
            <span className='custom-logo-part1'>Adarsh</span>
            <span className='custom-logo-part2'>Agency</span>
          </h5>
        </div>

        <h5>Hi Welcome to the Admin Dashboard</h5>
      </div>

      {/* Sidebar */}
      <div
        id='new-sidebar'
        className={`sidebar bg-dark text-white shadow position-fixed top-0 start-0 ${
          isOpen ? "open" : "collapsed"
        }`}
        style={{
          width: isOpen ? 250 : 0,
          transition: "width 0.3s",
          overflowX: "hidden",
          minHeight: "100vh",
          zIndex: 1040,
        }}
      >
        {/* Brand Header */}
        <div className='sidebar-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom'>
          <h5 className='m-0'>
            Aadarsh <span className='text-warning bg-white px-1'>Agency</span>
          </h5>
          <FiX
            className='sidebar-toggle text-white'
            style={{ cursor: "pointer" }}
            onClick={closeSidebar}
          />
        </div>

        {/* Dashboard Info */}
        <div className='px-3 py-0 '>
          {/* <h6 className="text-uppercase mb-1">Dashboard</h6> */}
          <div className='small text-muted'>Aadarsh &gt; Dashboard</div>
        </div>

        {/* Navigation */}
        <nav className='nav flex-column px-3 py-2'>
          <Link
            to='/'
            style={navLinkStyle("/")}
            onClick={closeSidebar}
            className='d-flex align-items-center gap-2'
          >
            <FiGrid /> Dashboard
          </Link>

          {/* Master */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("master")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Master <FiChevronDown size={12} />
            </button>
            {openDropdown === "master" && (
              <div className='ps-3'>
                <Link
                  to='/brand'
                  style={navLinkStyle("/brand")}
                  onClick={closeSidebar}
                >
                  Brand
                </Link>
                <Link
                  to='/product'
                  style={navLinkStyle("/product")}
                  onClick={closeSidebar}
                >
                  Product
                </Link>
                <Link
                  to='/Vendor-report'
                  style={navLinkStyle("/Vendor-report")}
                  onClick={closeSidebar}
                >
                  Vendor
                </Link>
                <Link
                  to='/add-customer'
                  style={navLinkStyle("/add-customer")}
                  onClick={closeSidebar}
                >
                  Customer
                </Link>
                <Link
                  to='/add-salesman'
                  style={navLinkStyle("/add-salesman")}
                  onClick={closeSidebar}
                >
                  Sales Man
                </Link>
                <Link
                  to='/display-salesman'
                  style={navLinkStyle("/display-salesman")}
                  onClick={closeSidebar}
                >
                  View Sales Man
                </Link>
              </div>
            )}
          </div>

          {/* Master */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("sales")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Sales <FiChevronDown size={12} />
            </button>
            {openDropdown === "sales" && (
              <div className='ps-3'>
                <Link
                  to='/brand'
                  style={navLinkStyle("/brand")}
                  onClick={closeSidebar}
                >
                  Brand
                </Link>
                <Link
                  to='/product'
                  style={navLinkStyle("/product")}
                  onClick={closeSidebar}
                >
                  Product
                </Link>
                <Link
                  to='/Vendor-report'
                  style={navLinkStyle("/Vendor-report")}
                  onClick={closeSidebar}
                >
                  Vendor
                </Link>
                <Link
                  to='/add-customer'
                  style={navLinkStyle("/add-customer")}
                  onClick={closeSidebar}
                >
                  Customer
                </Link>
                <Link
                  to='/add-salesman'
                  style={navLinkStyle("/add-salesman")}
                  onClick={closeSidebar}
                >
                  Sales Man
                </Link>
                <Link
                  to='/display-salesman'
                  style={navLinkStyle("/display-salesman")}
                  onClick={closeSidebar}
                >
                  View Sales Man
                </Link>
              </div>
            )}
          </div>

          {/* Purchasing */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("purchasing")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Purchase Bill <FiChevronDown size={12} />
            </button>
            {openDropdown === "purchasing" && (
              <div className='ps-3'>
                <Link
                  to='/purchase'
                  style={navLinkStyle("/purchase")}
                  onClick={closeSidebar}
                >
                  Purchase
                </Link>
              </div>
            )}
          </div>

          {/*Reciept  */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("reciept")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Reciept <FiChevronDown size={12} />
            </button>
            {openDropdown === "reciept" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Payment  */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("payment")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Payment <FiChevronDown size={12} />
            </button>
            {openDropdown === "payment" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Modify Bill  */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("modifybill")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Modify Bill <FiChevronDown size={12} />
            </button>
            {openDropdown === "modifybill" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Ledger Account */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("ledger")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Ledger Account <FiChevronDown size={12} />
            </button>
            {openDropdown === "ledger" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Outstanding*/}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("outstanding")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Outstanding <FiChevronDown size={12} />
            </button>
            {openDropdown === "outstanding" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Stock Status*/}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("stockstatus")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Stock Status <FiChevronDown size={12} />
            </button>
            {openDropdown === "stockstatus" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Stock And sale Analysis*/}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("stocksale")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Stock And sale Analysis <FiChevronDown size={12} />
            </button>
            {openDropdown === "stocksale" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Dispatch Summary*/}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("dispatch")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers />
              Dispatch Summary <FiChevronDown size={12} />
            </button>
            {openDropdown === "dispatch" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/*Today Gross Profit*/}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("grossprofit")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers />
              Today Gross Profit <FiChevronDown size={12} />
            </button>
            {openDropdown === "grossprofit" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/* Billing */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("billing")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Billing <FiChevronDown size={12} />
            </button>
            {openDropdown === "billing" && (
              <div className='ps-3'>
                <Link
                  to='/add-invoice'
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          {/* Report */}
          <div className='dropdown mt-2'>
            <button
              onClick={() => toggleDropdown("report")}
              className='btn  text-white w-100 text-start d-flex align-items-center gap-2'
            >
              <FiLayers /> Report <FiChevronDown size={12} />
            </button>
            {openDropdown === "report" && (
              <div className='ps-3'>
                <span className='nav-link text-white ps-3'>(Coming Soon)</span>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbarfrist;
