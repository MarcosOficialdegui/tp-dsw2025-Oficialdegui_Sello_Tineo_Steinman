import styles from "./Footer.module.css";
import {
  MdPhone,         // Teléfono
  MdEmail,         // Email
  MdLocationOn,    // Ubicación
} from "react-icons/md";
import {
  FaFacebook,      // Facebook
  FaInstagram,     // Instagram
  FaTwitter        // Twitter
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-content"]}>
        <div className={styles["footer-grid"]}>
          {/* Company Info */}
          <div>
            <div className={styles["footer-company"]}>
              <img 
                src="/images/Logo-ATC-Circular.png"
                alt="Logo AlquilaTuCancha" 
                className={styles["footer-logo"]} 
              />
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className={styles["footer-section-title"]}>Contacto</h4>
            <div className={styles["footer-contact"]}>
              <a href="tel:+541112345678" className={styles["footer-link"]}>
                <MdPhone size={16} color="#4CAF50" />
                &nbsp;+54 341 305 5793
              </a>
              <a href="mailto:info@sportcourt.com" className={styles["footer-link"]}>
                <MdEmail size={16} color="#4CAF50" />
                &nbsp;tomastineo04@gmail.com
              </a>
              <span className={styles["footer-address"]}>
                <MdLocationOn size={16} color="#4CAF50" />
                &nbsp; Zeballos 1341, Rosario, Santa Fe
              </span>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className={styles["footer-section-title"]}>Servicios</h4>
            <div className={styles["footer-services"]}>
              <a href="#" className={styles["footer-link"]}>Alquiler de Canchas</a>
              <a href="#" className={styles["footer-link"]}>Torneos</a>
              <a href="#" className={styles["footer-link"]}>Clases Particulares</a>
              <a href="#" className={styles["footer-link"]}>Eventos Corporativos</a>
            </div>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className={styles["footer-section-title"]}>Síguenos</h4>
            <div className={styles["footer-social"]}>
              <a href="#" className={styles["footer-social-link"]}>
                <FaFacebook size={20} color="#1877F2" />
              </a>
              <a href="#" className={styles["footer-social-link"]}>
                <FaInstagram size={20} color="#E4405F" />
              </a>
              <a href="#" className={styles["footer-social-link"]}>
                <FaTwitter size={20} color="#1DA1F2" />
              </a>
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
