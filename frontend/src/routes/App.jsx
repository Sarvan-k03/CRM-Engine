import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayout from '../components/DashboardLayout';
import { AuthProvider } from '../context/AuthContext';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';

const Analytics = lazy(() => import('../pages/Analytics'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const LeadDetails = lazy(() => import('../pages/LeadDetails'));
const Leads = lazy(() => import('../pages/Leads'));
const Login = lazy(() => import('../pages/Login'));
const Pipeline = lazy(() => import('../pages/Pipeline'));
const Settings = lazy(() => import('../pages/Settings'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/leads/:id" element={<LeadDetails />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/settings" element={<Settings />} />
                <Route element={<AdminRoute />}>
                  <Route path="/analytics" element={<Analytics />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}