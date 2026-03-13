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
        .then(data => { if (data.rol) setRol(data.rol); })
        .catch(() => setRol(''));
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <h2>Alquila Tu Cancha</h2>
        </Link>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {rol === 'propietario' && (
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          )}
          <Link to="/" onClick={closeMenu}>Inicio</Link>
          <Link to="/complejos" onClick={closeMenu}>Complejos</Link>

          {isLoggedIn ? (
            <>
              <Link to="/perfil" onClick={closeMenu}>Perfil</Link>
              <a href="/" onClick={handleLogout}>Cerrar Sesión</a>
            </>
          ) : (
            <>
              <Link to="/tipoUsuario" onClick={closeMenu}>Registrarse</Link>
              <Link to="/login" onClick={closeMenu}>Iniciar Sesión</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}