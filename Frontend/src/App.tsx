import Header from './components/Header';
import Home from './pages/Home';
import UsuarioFormRegistro from './pages/UsuarioFormRegistro';
import UsuarioFormLogin from './pages/UsuarioFormLogin';

import Perfil from './pages/Perfil';

import Complejo from './pages/Complejo';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<UsuarioFormRegistro />} />
        <Route path="/login" element={<UsuarioFormLogin />} /> 
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/complejo/:id" element={<Complejo />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;