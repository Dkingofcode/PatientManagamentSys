import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import  { Provider } from 'react-redux';
import { store } from './store/store.ts'
//import useAurh from './hooks/useAuth.ts';
import { AppointmentProvider } from './contexts/AppointmentContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppointmentProvider> 
      <App />
      </AppointmentProvider>
    </Provider>
  </StrictMode>,
)
