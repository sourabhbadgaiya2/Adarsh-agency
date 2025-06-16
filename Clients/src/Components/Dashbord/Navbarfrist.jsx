import React, { useState } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiGrid, FiLayers, FiChevronDown, FiMenu } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbarfristn = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='vpfinancial-navbar'>
      <div className='blue-header   py-2'>
        <Container>
          <h1 className='brand-title mb-0'>
            Aadarsh{" "}
            <span style={{ color: "orange", backgroundColor: "white" }}>
              Agency
            </span>
          </h1>
        </Container>
      </div>

      <div className='dashboard-section p-4 '>
        <Container>
          <div className='dashboard-header d-flex justify-content-between align-items-center'>
            <h2 className='dashboard-title m-0'>Dashboard</h2>
            <div className='breadcrumb'>Aadarsh &gt; Dashboard</div>
          </div>
        </Container>
      </div>

      <Navbar
        bg='white'
        expand='lg'
        className='main-navigation border-top border-bottom'
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container fluid>
          <Navbar.Toggle
            aria-controls='main-navbar-nav'
            className='navbar-toggler-custom'
          >
            <FiMenu className='toggle-icon' />
          </Navbar.Toggle>

          <Navbar.Collapse id='main-navbar-nav'>
            <Nav className='me-auto gap-4'>
              <Nav.Link as={Link} to='/' className='nav-item'>
                <FiGrid className='nav-icon' />
                <span className='nav-text'>Dashboard</span>
              </Nav.Link>

              {/* Master */}
              <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
                <Dropdown.Toggle as={Nav.Link}>
                  <FiLayers className='nav-icon' />
                  Master <FiChevronDown size={12} className='ms-1' />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className='custom-dropdown p-4'
                  style={{ minWidth: "500px" }}
                >
                  <div className='row'>
                    {/* Brand */}
                    <div className='col-md-4'>
                      {/* <Dropdown.Item as={Link} to="/add-company">
                        Add Company
                      </Dropdown.Item> */}
                      <Dropdown.Item as={Link} to='/brand'>
                        Add Brand
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to='/product'>
                        Create Product
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to='/Vendor-report'>
                        Add Vendor
                      </Dropdown.Item>

                      {/* <Dropdown.Item as={Link} to="/pro-categories">
                        Product Category
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/pro-SubCat">
                        Product SubCategory
                      </Dropdown.Item> */}
                    </div>

                    {/* Product Master */}
                    <div className='col-md-4'>
                      <Dropdown.Item as={Link} to='/add-customer'>
                        Add Customer
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to='/add-salesman'>
                        Add Sales Man
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to='/display-salesman'>
                        Display Sales Man
                      </Dropdown.Item>
                      {/* <Dropdown.Item as={Link} to="/display-billing-report">
                        Product Billing Report
                      </Dropdown.Item> */}
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/* Purchasing */}
              <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
                <Dropdown.Toggle as={Nav.Link}>
                  <FiLayers className='nav-icon' />
                  Purchasing <FiChevronDown size={12} className='ms-1' />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className='custom-dropdown p-4'
                  style={{ minWidth: "200px" }}
                >
                  <div className='row'>
                    <div className='col-md-4'>
                      <Dropdown.Item as={Link} to='/purchase'>
                        Purchase
                      </Dropdown.Item>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/*Billing Product Invoice  */}
              <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
                <Dropdown.Toggle as={Nav.Link}>
                  <FiLayers className='nav-icon' />
                  Billing <FiChevronDown size={12} className='ms-1' />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className='custom-dropdown p-4'
                  style={{ minWidth: "300px" }}
                >
                  <div className='row'>
                    <div className='col-md-4'>
                      {/* Invoice */}
                      <Dropdown.Item as={Link} to='/add-invoice'>
                        Add New Billing
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to='/display-invoice'>
                        View Billing
                      </Dropdown.Item>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/* Report */}
              <Dropdown as={Nav.Item} className='nav-item dropdown-hover'>
                <Dropdown.Toggle as={Nav.Link}>
                  <FiLayers className='nav-icon' />
                  Report
                  <FiChevronDown size={12} className='ms-1' />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className='custom-dropdown p-4'
                  style={{ minWidth: "300px" }}
                >
                  <div className='row'>
                    <div className='col-md-2'></div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbarfristn;
