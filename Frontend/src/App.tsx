import Header from './components/Header'; 
import Home from './pages/Home';
import UsuarioFormRegistro from './pages/UsuarioFormRegistro';
import UsuarioFormLogin from './pages/UsuarioFormLogin';
import ScrollToTop from './components/ScrollToTop';
import Perfil from './pages/Perfil';
import TipoUsuario from './pages/UsuarioFormTipoUsuario';
import MisComplejos from './pages/MisComplejos';    
import Complejos from './pages/Complejos';
import Complejo from './pages/PerfilComplejo';
import Footer from './components/Footer';
import './App.css';

// 🟢 Importá React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <ScrollToTop />
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="complejos" element={<Complejos />} />
            <Route path="/registrarse" element={<UsuarioFormRegistro />} />
            <Route path="/login" element={<UsuarioFormLogin />} /> 
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/complejo/:id" element={<Complejo />} />
            <Route path="/tipoUsuario" element={<TipoUsuario />} />
            <Route path="/miscomplejos" element={<MisComplejos />} />
          </Routes>
        </main>
        <Footer />

        {/* Notificaciones */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
