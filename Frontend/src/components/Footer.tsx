import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-content"]}>
        <div className={styles["footer-grid"]}>
          {/* Company Info */}
          <div>
            <div className={styles["footer-company"]}>
              <div className={styles["footer-logo"]}>⚽</div>
              <h3 className={styles["footer-title"]}>AlquilaTuCancha</h3>
            </div>
            <p className={styles["footer-description"]}>
              Los mejores complejos para disfrutar de tus deportes favoritos con instalaciones de primera calidad.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles["footer-section-title"]}>Contacto</h4>
            <div className={styles["footer-contact"]}>
              <a href="tel:+541112345678" className={styles["footer-link"]}>
                📞 +54 341 305 5793
              </a>
              <a href="mailto:info@sportcourt.com" className={styles["footer-link"]}>
                ✉️ tomastineo04@gmail.com
              </a>
              <span className={styles["footer-address"]}>
                📍 Av. Principal 123, Ciudad
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className={styles["footer-section-title"]}>Servicios</h4>
            <div className={styles["footer-services"]}>
              <a href="#" className={styles["footer-link"]}>Alquiler de Canchas</a>
              <a href="#" className={styles["footer-link"]}>Torneos</a>
              <a href="#" className={styles["footer-link"]}>Clases Particulares</a>
              <a href="#" className={styles["footer-link"]}>Eventos Corporativos</a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className={styles["footer-section-title"]}>Síguenos</h4>
            <div className={styles["footer-social"]}>
              <a href="#" className={styles["footer-social-link"]}>📘</a>
              <a href="#" className={styles["footer-social-link"]}>📷</a>
              <a href="#" className={styles["footer-social-link"]}>🐦</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles["footer-copyright"]}>
          <p className={styles["footer-copyright-text"]}>
            © 2025 AlquilaTuCancha. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
