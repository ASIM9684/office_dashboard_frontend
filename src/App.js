import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './admin_panel/component/Layout/layout';
import Dashboard from './admin_panel/component/DashBoard';
import AddEmployeeForm from './admin_panel/component/employee/AddEmployeeForm';
import EmployeesPage from './admin_panel/component/employee/Employees';
import Login from './admin_panel/component/Login';
import EditEmployeeForm from './admin_panel/component/employee/EditEmployeeForm';
import DepartmentPage from './admin_panel/component/department/Department';
import AddDepartmentForm from './admin_panel/component/department/AddDepartmentForm';
import EditDepartmentForm from './admin_panel/component/department/EditDepartmentForm';
import { jwtDecode } from 'jwt-decode';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // Check token expiry
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/department"
          element={
            <PrivateRoute>
              <Layout><DepartmentPage /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-department"
          element={
            <PrivateRoute>
              <Layout><AddDepartmentForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-department"
          element={
            <PrivateRoute>
              <Layout><EditDepartmentForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Layout><EmployeesPage /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-employee"
          element={
            <PrivateRoute>
              <Layout><AddEmployeeForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-employee"
          element={
            <PrivateRoute>
              <Layout><EditEmployeeForm /></Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
