import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

import VisitorList from './pages/Visitors/VisitorList';
import VisitorForm from './pages/Visitors/VisitorForm';
import VisitorDetail from './pages/Visitors/VisitorDetail';

import AppointmentList from './pages/Appointments/AppointmentList';
import AppointmentForm from './pages/Appointments/AppointmentForm';
import AppointmentDetail from './pages/Appointments/AppointmentDetail';

import PassList from './pages/Passes/PassList';
import PassForm from './pages/Passes/PassForm';
import PassDetail from './pages/Passes/PassDetail';

import CheckLogList from './pages/CheckLogs/CheckLogList';
import ScanPass from './pages/CheckLogs/ScanPass';

import Summary from './pages/Reports/Summary';
import DailyVisits from './pages/Reports/DailyVisits';
import HostVisits from './pages/Reports/HostVisits';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Visitors */}
          <Route
            path="/visitors"
            element={
              <ProtectedRoute>
                <VisitorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitors/new"
            element={
              <ProtectedRoute>
                <VisitorForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitors/edit/:id"
            element={
              <ProtectedRoute>
                <VisitorForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitors/:id"
            element={
              <ProtectedRoute>
                <VisitorDetail />
              </ProtectedRoute>
            }
          />

          {/* Appointments */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/new"
            element={
              <ProtectedRoute>
                <AppointmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/edit/:id"
            element={
              <ProtectedRoute>
                <AppointmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:id"
            element={
              <ProtectedRoute>
                <AppointmentDetail />
              </ProtectedRoute>
            }
          />

          {/* Passes */}
          <Route
            path="/passes"
            element={
              <ProtectedRoute>
                <PassList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passes/new"
            element={
              <ProtectedRoute>
                <PassForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passes/:id"
            element={
              <ProtectedRoute>
                <PassDetail />
              </ProtectedRoute>
            }
          />

          {/* Check logs & Scan */}
          <Route
            path="/checklogs"
            element={
              <ProtectedRoute>
                <CheckLogList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute allowedRoles={['security', 'admin']}>
                <ScanPass />
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Summary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/daily-visits"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DailyVisits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/host-visits"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HostVisits />
              </ProtectedRoute>
            }
          />

          {/* Default & catch-all */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
