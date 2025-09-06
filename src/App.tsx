// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import FrontDeskDashboard from "./pages/FrontDeskDashboard";
import LoginPage from "./pages/LoginPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import LabTechnicianDashboard from "./pages/LabTechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import PatientRegistration from "./pages/PatientRegistration";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
//import XRayDashboard from "./pages/XrayDashboard";
import InventoryDashboard from "./pages/InventoryDashboard";
import RadiologyDashboard from "./pages/RadiologyDashboard";
import SonographyDashboard from "./pages/SonographyDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppointmentProvider>
          <NotificationProvider>
            <Routes>
              {/* Default redirect from / to /login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route path="/login" element={<LoginPage />} />

              {/* Public routes */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Unprotected routes (if intentional) */}
              <Route path="/front-desk" element={<FrontDeskDashboard />} />
              <Route
                path="/front-desk/register-patient"
                element={<PatientRegistration />}
              />
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route
                path="/lab-technician"
                element={<LabTechnicianDashboard />}
              />
              <Route
                path="/sonography"
                element={
                  <ProtectedRoute
                    allowedRoles={["sonography"]}
                    element={<SonographyDashboard />}
                  />
                }
              />
              <Route
                path="/radiology"
                element={
                  <ProtectedRoute
                    allowedRoles={["radiology"]}
                    element={<RadiologyDashboard />}
                  />
                }
              />

              <Route path="/admin" element={<AdminDashboard />} />

              {/* Protected routes */}
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "inventory-manager"]}
                    element={<InventoryDashboard />}
                  />
                }
              />
              <Route
                path="/patient"
                element={
                  <ProtectedRoute
                    allowedRoles={["patient"]}
                    element={<PatientDashboard />}
                  />
                }
              />
            </Routes>
          </NotificationProvider>
        </AppointmentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
