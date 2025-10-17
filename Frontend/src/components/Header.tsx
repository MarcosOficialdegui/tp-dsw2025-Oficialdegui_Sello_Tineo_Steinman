import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; 

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rol, setRol] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.rol) setRol(data.rol);
        })
        .catch(() => setRol(''));
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h2>Alquila tu cancha</h2>
        </Link>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {rol === 'propietario' && <a href="/miscomplejos">Mis Complejos</a>}
          <a href="/">Inicio</a>
          <a href="/complejos">Complejos</a>
          <a href="/contacto">Contacto</a>

          {isLoggedIn ? (
            <>
              <a href="/perfil">Perfil</a>
              <a href="/" onClick={handleLogout}>Cerrar Sesión</a>
            </>
          ) : (
            <>
              <a href="/tipoUsuario">Registrarse</a>
              <a href="/login">Iniciar Sesión</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
