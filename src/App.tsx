// src/App.tsx
//import { useEffect } from 'react';
//import { useDispatch } from 'react-redux';
//import { setUserFromStorage } from './store/authSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import LoginPage from './pages/LoginPage';
//import PrivateRoute from './components/ProtectedRoute';
// Import your other pages here
import FrontDeskDashboard from './pages/FrontDeskDashboard';
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import LabTechnicianDashboard from './pages/LabTechnicianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';


function App() {
  //const dispatch = useDispatch();

  // useEffect(() => {
  //   // Check if user is logged in from localStorage
  //   dispatch(setUserFromStorage());
  // }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route>
          {/* Protected routes */}
          <Route path="/" element={<FrontDeskDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/lab-technician" element={<LabTechnicianDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;