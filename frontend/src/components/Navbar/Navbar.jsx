import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import userIcon from '../../assets/userIcon.png';
import signOutIcon from '../../assets/iconSignOut.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef({ inventory: null, reports: null, user: null });
  const [user, setUser] = useState(null);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setStoreId(parsedUser.storeId || 1); // Asigna storeId o un valor por defecto
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRefs.current.inventory &&
        !menuRefs.current.inventory.contains(event.target) &&
        menuRefs.current.reports &&
        !menuRefs.current.reports.contains(event.target) &&
        menuRefs.current.user &&
        !menuRefs.current.user.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo de la empresa" className="navbar-logo" />
        <h1 className="navbar-title">Alfa y Omega</h1>
      </div>

      <div className="navbar-center">
        <Link to="/dashboard" className="navbar-link">Inicio</Link>

        <div className="navbar-dropdown" ref={(el) => (menuRefs.current.inventory = el)}>
          <button 
            onClick={() => setOpenMenu(openMenu === "inventory" ? null : "inventory")}
            className="navbar-link"
            aria-label="Inventory"
          >
            Inventario
          </button>
          {openMenu === "inventory" && (
            <div className="dropdown-menu">
              <Link to="/local-inventory" className="dropdown-item">Inventario Local</Link>
              <Link to="/second-point-inventory" className="dropdown-item">Inventario Segundo Punto</Link>
            </div>
          )}
        </div>

        {user?.rol === 'administrador' && (
          <div className="navbar-dropdown" ref={(el) => (menuRefs.current.reports = el)}>
            <button 
              onClick={() => setOpenMenu(openMenu === "reports" ? null : "reports")}
              className="navbar-link"
              aria-label="Reports"
            >
              Reportes
            </button>
            {openMenu === "reports" && (
              <div className="dropdown-menu">
                <Link to="/local-report" className="dropdown-item">Reporte Local</Link>
                <Link to="/second-point-report" className="dropdown-item">Reporte Segundo Punto</Link>
              </div>
            )}
          </div>
        )}

        {user?.rol === 'administrador' && (
          <Link to="/account-admin" className="navbar-link">Admin Cuentas</Link>
        )}
      </div>

      <div className="navbar-right" ref={(el) => (menuRefs.current.user = el)}>
        <button 
          onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
          className="navbar-button"
          aria-label="User Menu"
        >
          <img src={signOutIcon} alt="Usuario" />
        </button>
        {openMenu === "user" && (
          <div className="user-menu">
            <img src={userIcon} alt="Usuario" className="user-icon" />
            <p className="user-name">{user ? user.nombre : 'Usuario'}</p>
            <p className="user-role">{user ? user.rol : 'Sin Rol'}</p>
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




