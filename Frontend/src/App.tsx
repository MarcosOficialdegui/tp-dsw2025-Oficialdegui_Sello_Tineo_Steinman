import Header from './components/Header';
import Home from './pages/Home';
import UsuarioFormRegistro from './pages/UsuarioFormRegistro';
import UsuarioFormLogin from './pages/UsuarioFormLogin';
import Complejo from './pages/Complejo';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<UsuarioFormRegistro />} />
        <Route path="/login" element={<UsuarioFormLogin />} />
        <Route path="/complejo/:id" element={<Complejo />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;