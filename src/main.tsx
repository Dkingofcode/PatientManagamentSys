import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
//import  { Provider } from 'react-redux';
//import { store } from './store/store.ts'
//import useAuth from './hooks/useAuth.ts';
import { AppointmentProvider } from './contexts/AppointmentContext.tsx';
import {AuthProvider} from './contexts/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppointmentProvider> 
      <App />
      </AppointmentProvider>
      </AuthProvider>
  </StrictMode>,
)
