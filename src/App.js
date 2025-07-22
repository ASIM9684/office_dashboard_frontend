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
import Addleave from './admin_panel/component/leave/Addleave';
import LeavePage from './admin_panel/component/leave/Leave';
import Profile from './admin_panel/component/profile/Profile';
import AttendanceCardList from './admin_panel/component/cards/AttendanceCard';
import ClockInToday from './admin_panel/component/ClockInToday';
import AssignTask from './admin_panel/component/task/AssignTask';
import Task from './admin_panel/component/task/Task';
import { ToastContainer } from 'react-toastify';
import RoleProtectedRoute from './admin_panel/utils/RoleProtectedRoute';
import Email from './admin_panel/component/profile/Email';
import ResetPassword from './admin_panel/component/profile/ResetPassword';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
const LoginRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>

        <Route path="/login" element={<LoginRoute><Login />  </LoginRoute>} />

<Route
  path="/email"
  element={
    <Email />
  }
/>

   <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout><Profile /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Task"
          element={
            <PrivateRoute>
              <Layout><Task /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ClockInToday"
          element={
            <PrivateRoute>
              <Layout><ClockInToday /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AttendanceCardList/:id"
          element={
            <PrivateRoute>
              <Layout><AttendanceCardList /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-leave"
          element={
            <PrivateRoute>
              <Layout><Addleave /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <PrivateRoute>
              <Layout><LeavePage /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AssignTask/:id"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Layout><AssignTask /></Layout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/department"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Layout><DepartmentPage /></Layout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/add-department"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Layout><AddDepartmentForm /></Layout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-department"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Layout><EditDepartmentForm /></Layout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Layout><EmployeesPage /></Layout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/add-employee"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Layout><AddEmployeeForm /></Layout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-employee"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Layout><EditEmployeeForm /></Layout>
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
