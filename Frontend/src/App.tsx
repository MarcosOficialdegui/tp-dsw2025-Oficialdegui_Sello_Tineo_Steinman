import Header from './components/Header';
import Home from './pages/Home';
import UsuarioFormRegistro from './pages/UsuarioFormRegistro';
import UsuarioFormLogin from './pages/UsuarioFormLogin';
<<<<<<< HEAD
import Perfil from './pages/Perfil';
=======
import Complejo from './pages/Complejo';
>>>>>>> a251937e9476e5ba8766418af9981f4316c29222

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
<<<<<<< HEAD
        <Route path="/perfil" element={<Perfil />} />
=======
        <Route path="/complejo/:id" element={<Complejo />} />
>>>>>>> a251937e9476e5ba8766418af9981f4316c29222
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;