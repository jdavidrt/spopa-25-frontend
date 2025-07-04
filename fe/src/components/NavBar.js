// fe/src/components/NavBar.js
import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/SPOPALogo.png";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";
import { useSession } from "../utils/sessionManager";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated: auth0Authenticated,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const {
    session,
    isAuthenticated: sessionAuthenticated,
    destroySession
  } = useSession();

  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = async () => {
    try {
      // First destroy server session
      await destroySession();

      // Then logout from Auth0
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: logout from Auth0 even if session destruction fails
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
      });
    }
  };

  // Use session authentication state, fallback to Auth0 state
  const isAuthenticated = sessionAuthenticated || auth0Authenticated;
  const currentUser = session.user || user;
  const userType = session.userType;

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md" container={false}>
        <Container>
          <RouterNavLink to="/" className="navbar-brand d-flex align-items-center">
            <img
              className="app-logo me-2"
              src={logo}
              alt="SPOPA logo"
              width="60"
            />
            <span className="fw-bold text-primary">SPOPA</span>
          </RouterNavLink>

          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Home
                </NavLink>
              </NavItem>

              {/* Student Routes */}
              {isAuthenticated && userType === "Estudiante" && (
                <>
                  <NavItem>
                    <NavLink
                      tag={RouterNavLink}
                      to="/studentoffers"
                      exact
                      activeClassName="router-link-exact-active"
                    >
                      Student Offers
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag={RouterNavLink}
                      to="/professors"
                      exact
                      activeClassName="router-link-exact-active"
                    >
                      Professors
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag={RouterNavLink}
                      to="/mychecklist"
                      exact
                      activeClassName="router-link-exact-active"
                    >
                      My Checklist
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag={RouterNavLink}
                      to="/process"
                      exact
                      activeClassName="router-link-exact-active"
                    >
                      My Checklist
                    </NavLink>
                  </NavItem>
                </>
              )}

              {/* Administrative Routes */}
              {isAuthenticated && userType === "Administrativo" && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/admin"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Admin Dashboard
                  </NavLink>
                </NavItem>
              )}

              {/* Business Routes */}
              {isAuthenticated && userType === "Empresa" && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/business"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Business Portal
                  </NavLink>
                </NavItem>
              )}

              {/* Show role selection hint if authenticated but no role selected */}
              {isAuthenticated && !userType && (
                <NavItem>
                  <NavLink disabled className="text-warning">
                    <FontAwesomeIcon icon="user" className="me-1" />
                    Please select your role
                  </NavLink>
                </NavItem>
              )}
            </Nav>

            {/* Desktop Navigation */}
            <Nav className="d-none d-md-block" navbar>
              {!isAuthenticated && (
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Log in
                  </Button>
                </NavItem>
              )}

              {isAuthenticated && currentUser && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={currentUser.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                    <span className="d-none d-lg-inline">
                      {currentUser.name}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>
                      <div>
                        <strong>{currentUser.name}</strong>
                        <br />
                        <small className="text-muted">{currentUser.email}</small>
                        {userType && (
                          <div>
                            <span className="badge badge-primary mt-1">
                              {userType}
                            </span>
                          </div>
                        )}
                      </div>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="me-2" />
                      Profile
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={logoutWithRedirect}
                    >
                      <FontAwesomeIcon icon="power-off" className="me-2" />
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>

            {/* Mobile Navigation */}
            {!isAuthenticated && (
              <Nav className="d-md-none" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect()}
                  >
                    Log in
                  </Button>
                </NavItem>
              </Nav>
            )}

            {isAuthenticated && currentUser && (
              <Nav
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <div className="user-info d-flex align-items-center">
                    <img
                      src={currentUser.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h6 className="mb-0">{currentUser.name}</h6>
                      <small className="text-muted">{currentUser.email}</small>
                      {userType && (
                        <div>
                          <span className="badge badge-primary">
                            {userType}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </NavItem>
                <NavItem>
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                    className="d-flex align-items-center text-decoration-none"
                  >
                    <FontAwesomeIcon icon="user" className="me-2" />
                    Profile
                  </RouterNavLink>
                </NavItem>
                <NavItem>
                  <button
                    className="btn btn-link text-decoration-none d-flex align-items-center"
                    id="qsLogoutBtn"
                    onClick={logoutWithRedirect}
                  >
                    <FontAwesomeIcon icon="power-off" className="me-2" />
                    Logout
                  </button>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;