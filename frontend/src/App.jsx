import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'; 
import Dashboard from './pages/Dashboard/Dashboard';
import AccountAdmin from './pages/AccountAdminPage/AccountAdminPage'; 
import LocalInventory from './pages/Inventory/LocalInventory/Localinventory'; 
import SecondPointInventory from './pages/Inventory/SecondPointInventory/SecondPointInventory';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); 
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account-admin" 
          element={
            <ProtectedRoute>
              <AccountAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/local-inventory" 
          element={
            <ProtectedRoute>
              <LocalInventory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/second-point-inventory" 
          element={
            <ProtectedRoute>
              <SecondPointInventory />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
