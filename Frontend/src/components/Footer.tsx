import "./Footer.module.css"

export default function Footer() {
return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div>
            <div className="footer-company">
              <div className="footer-logo">⚽</div>
              <h3 className="footer-title">SportCourt</h3>
            </div>
            <p className="footer-description">
              Los mejores complejos para disfrutar de tus deportes favoritos con instalaciones de primera calidad.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-section-title">Contacto</h4>
            <div className="footer-contact">
              <a
                href="tel:+541112345678"
                className="footer-link"
              >
                📞 +54 11 1234-5678
              </a>
              <a
                href="mailto:info@sportcourt.com"
                className="footer-link"
              >
                ✉️ info@sportcourt.com
              </a>
              <span className="footer-address">
                📍 Av. Principal 123, Ciudad
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-section-title">Servicios</h4>
            <div className="footer-services">
              <a href="#" className="footer-link">Alquiler de Canchas</a>
              <a href="#" className="footer-link">Torneos</a>
              <a href="#" className="footer-link">Clases Particulares</a>
              <a href="#" className="footer-link">Eventos Corporativos</a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="footer-section-title">Síguenos</h4>
            <div className="footer-social">
              <a href="#" className="footer-social-link">📘</a>
              <a href="#" className="footer-social-link">📷</a>
              <a href="#" className="footer-social-link">🐦</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p className="footer-copyright-text">
            © 2024 SportCourt. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
