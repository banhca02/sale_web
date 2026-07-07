import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Agencies from './pages/agencies';
import Records from './pages/records';
import AdminSales from './pages/adminSales';
import ProtectedRoute from './context/ProtectedRoute';
import AdminRoute from './context/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/agencies/:id" element={<Records />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/sales" element={<AdminSales />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;