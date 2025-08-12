import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import ConfirmarPresenca from './pages/ConfirmarPresença.jsx';
import Local from './pages/Local.jsx';  
import Presentes from './pages/Presentes.jsx';

import AdminLogin from './pages/Matdeba.jsx';
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/confirmar" element={<ConfirmarPresenca />} />
        <Route path="/local" element={<Local />} />
        <Route path="/presentes" element={<Presentes />} />
        <Route path="/Matdeba" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
