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


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import './App.css';

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
      </div>
    </BrowserRouter>
  );
}

export default App;