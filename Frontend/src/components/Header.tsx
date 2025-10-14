import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';

export default function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rol, setRol] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Si el token es verdadero la variable es verdadera


    // Validar rol
    fetch('http://localhost:3000/api/usuarios/perfil', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

      .then(res => res.json())
      .then(data => {
        if (data.rol) {
          setRol(data.rol);
        }
      })
      .catch(err => {
        console.error('Error al obtener el perfil del usuario:', err);
        setRol('');
      });

  }, []);

  return (


    <header className={styles.header}>
      <div className={styles.container}>

        <Link to="/" className={styles.logo}>
          <h2>Alquila tu cancha</h2>
        </Link>


        <nav className={styles.nav}>

          {rol === 'propietario' && (
            <a href="/miscomplejos">Mis Complejos</a>
          )}

          <a href="/">Inicio</a>
          <a href="/complejos">Complejos</a>
          <a href="/contacto">Contacto</a>


          {isLoggedIn ? (
            <>

              <a href="/perfil">Perfil</a>
              <a href="/" onClick={(e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = "/";
              }}>Cerrar Sesion</a>

            </>
          ) : (
            <>

              <a href="/tipoUsuario">Registrarse</a>
              <a href="/login">Iniciar Sesion</a>

            </>
          )}


        </nav>
      </div>
    </header>

  );
}