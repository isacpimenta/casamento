import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import ConfirmarPresenca from './pages/ConfirmarPresença.jsx';
import Local from './pages/Local.jsx';  
import Presentes from './pages/Presentes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/confirmar" element={<ConfirmarPresenca />} />
        <Route path="/local" element={<Local />} />
        <Route path="/presentes" element={<Presentes />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)