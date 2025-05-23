import React, { useState, useEffect } from "react";
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


const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
    });

  useEffect(() => {
    const syncUserType = () => {
      setUserType(localStorage.getItem("userType"));
    };

    // Evento personalizado para cambios locales
    window.addEventListener("userTypeChange", syncUserType);

    // Evento para sincronizar entre pestañas
    window.addEventListener("storage", syncUserType);

    return () => {
      window.removeEventListener("userTypeChange", syncUserType);
      window.removeEventListener("storage", syncUserType);
    };
  }, []);

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md" container={false}>
        <Container>
          <img className="mb-3 app-logo" src={logo} alt="React logo" width="60" />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <NavItem>
              <NavLink
                tag={RouterNavLink}
                to="/"
                exact
                activeClassName="router-link-exact-active"
              >
                Inicio
              </NavLink>
            </NavItem>

            {/* Rutas para Estudiante */}
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
                    Mi Checklist
                  </NavLink>
                </NavItem>
              </>
            )}

            {/* Rutas para Administrativo */}
            {isAuthenticated && userType === "Administrativo" && (
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/admin"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Admin Offers
                </NavLink>
              </NavItem>
            )}

            {/* Rutas para Empresa */}
            {isAuthenticated && userType === "Empresa" && (
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/offers"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Offers
                </NavLink>
              </NavItem>
            )}

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

              {isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Perfil
                    </DropdownItem>
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /> Cerrar Sesión
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </NavItem>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    Perfil
                  </RouterNavLink>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
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
