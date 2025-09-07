import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (

    
    <header className={styles.header}>
      <div className={styles.container}>
        
        <Link to="/" className={styles.logo}>
        <h2>Alquila tu cancha</h2>
        </Link>
       
        
        <nav className={styles.nav}>
          <a href="/">Inicio</a>
          <a href="/complejos">Complejos</a>
          <a href="/contacto">Contacto</a>
          <a href="/registrarse">Registrarse</a>
          <a href="/login">Iniciar Sesion</a>
        </nav>
      </div>
    </header>

  );
}