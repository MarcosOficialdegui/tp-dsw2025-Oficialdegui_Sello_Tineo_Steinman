import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>AlquilaTuCancha</h1>
        <nav className={styles.nav}>
          <a href="/">Inicio</a>
          <a href="/complejos">Complejos</a>
          <a href="/contacto">Contacto</a>
        </nav>
      </div>
    </header>
  );
}