import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
//import  { Provider } from 'react-redux';
//import { store } from './store/store.ts'
//import useAuth from './hooks/useAuth.ts';
import { AppointmentProvider } from "./contexts/AppointmentContext";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppointmentProvider>
        <App />
      </AppointmentProvider>
    </AuthProvider>
  </StrictMode>
);
