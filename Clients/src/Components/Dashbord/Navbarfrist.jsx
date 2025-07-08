// import React, { useState } from "react";
// import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { FiGrid, FiLayers, FiChevronDown, FiMenu } from "react-icons/fi";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Navbarfristn = () => {
//   const [expanded, setExpanded] = useState(false);

//   const [activeDropdown, setActiveDropdown] = useState("");

//   return (
//     <div className='vpfinancial-navbar'>
//       <div className='blue-header   py-2'>
//         <Container>
//           <h1 className='brand-title mb-0'>
//             Aadarsh
//             <span style={{ color: "orange", backgroundColor: "white" }}>
//               Agency
//             </span>
//           </h1>
//         </Container>
//       </div>

//       <div className='dashboard-section p-4 '>
//         <Container>
//           <div className='dashboard-header d-flex justify-content-between align-items-center'>
//             <h2 className='dashboard-title m-0'>Dashboard</h2>
//             <div className='breadcrumb'>Aadarsh &gt; Dashboard</div>
//           </div>
//         </Container>
//       </div>

//       <Navbar
//         bg='white'
//         expand='lg'
//         className='main-navigation border-top border-bottom'
//         expanded={expanded}
//         onToggle={() => setExpanded(!expanded)}
//       >
//         <Container fluid>
//           <Navbar.Toggle
//             aria-controls='main-navbar-nav'
//             className='navbar-toggler-custom'
//           >
//             <FiMenu className='toggle-icon' />
//           </Navbar.Toggle>

//           <Navbar.Collapse id='main-navbar-nav'>
//             <Nav className='me-auto gap-4'>
//               <Nav.Link as={Link} to='/' className='nav-item'>
//                 <FiGrid className='nav-icon' />
//                 <span className='nav-text'>Dashboard</span>
//               </Nav.Link>

//               {/* Master */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link}>
//                   <FiLayers className='nav-icon' />
//                   Master <FiChevronDown size={12} className='ms-1' />
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu
//                   className='custom-dropdown p-4'
//                   style={{ minWidth: "500px" }}
//                 >
//                   <div className='row'>
//                     {/* Brand */}
//                     <div className='col-md-4'>
//                       {/* <Dropdown.Item as={Link} to="/add-company">
//                         Add Company
//                       </Dropdown.Item> */}
//                       <Dropdown.Item as={Link} to='/brand'>
//                         Brand
//                       </Dropdown.Item>
//                       <Dropdown.Item as={Link} to='/product'>
//                         Product
//                       </Dropdown.Item>
//                       <Dropdown.Item as={Link} to='/Vendor-report'>
//                         Vendor
//                       </Dropdown.Item>

//                       {/* <Dropdown.Item as={Link} to="/pro-categories">
//                         Product Category
//                       </Dropdown.Item>
//                       <Dropdown.Item as={Link} to="/pro-SubCat">
//                         Product SubCategory
//                       </Dropdown.Item> */}
//                     </div>

//                     {/* Product Master */}
//                     <div className='col-md-4'>
//                       <Dropdown.Item as={Link} to='/add-customer'>
//                         Customer
//                       </Dropdown.Item>
//                       <Dropdown.Item as={Link} to='/add-salesman'>
//                         Sales Man
//                       </Dropdown.Item>

//                       {/* <Dropdown.Item as={Link} to='/display-salesman'>
//                         View Sales Man
//                       </Dropdown.Item> */}
//                       {/* <Dropdown.Item as={Link} to="/display-billing-report">
//                         Product Billing Report
//                       </Dropdown.Item> */}
//                     </div>
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* Purchasing */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link}>
//                   <FiLayers className='nav-icon' />
//                   Purchasing <FiChevronDown size={12} className='ms-1' />
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu
//                   className='custom-dropdown p-4'
//                   style={{ minWidth: "200px" }}
//                 >
//                   <div className='row'>
//                     <div className='col-md-4'>
//                       <Dropdown.Item as={Link} to='/purchase'>
//                         Purchase
//                       </Dropdown.Item>
//                     </div>
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/*Billing Product Invoice  */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link}>
//                   <FiLayers className='nav-icon' />
//                   Billing <FiChevronDown size={12} className='ms-1' />
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu
//                   className='custom-dropdown p-4'
//                   style={{ minWidth: "300px" }}
//                 >
//                   <div className='row'>
//                     <div className='col-md-4'>
//                       {/* Invoice */}
//                       <Dropdown.Item as={Link} to='/add-invoice'>
//                         Add New Billing
//                       </Dropdown.Item>

//                       <Dropdown.Item as={Link} to='/display-invoice'>
//                         View Billing
//                       </Dropdown.Item>
//                     </div>
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* Report */}
//               <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
//                 <Dropdown.Toggle as={Nav.Link}>
//                   <FiLayers className='nav-icon' />
//                   Report
//                   <FiChevronDown size={12} className='ms-1' />
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu
//                   className='custom-dropdown p-4'
//                   style={{ minWidth: "300px" }}
//                 >
//                   <div className='row'>
//                     <div className='col-md-2'></div>
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

        {/* <h5>Hi Welcome to the Admin Dashboard</h5> */}
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
                  to='/test'
                  style={navLinkStyle("/test")}
                  onClick={closeSidebar}
                >
                  view ledger
                </Link>
                {/* <Link
                  to='/display-invoice'
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link> */}
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
