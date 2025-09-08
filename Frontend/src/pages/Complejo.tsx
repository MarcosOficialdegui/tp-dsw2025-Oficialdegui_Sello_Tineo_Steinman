import Header from "../components/Header"
import Footer from "../components/Footer"
import Calendar from "../components/Calendar"
import ComplejoInfo from "../components/ComplejoInfo"

import "./Complejo.css"

export default function Home() {
  return (
    <div className="complejo-container">



      {/* 
      Quizas mejor una foto del complejo y que esto vaya al home como hero
      Hero Section 

      <section className="complejo-hero">
        <div className="complejo-hero-content">
          <h1 className="complejo-title">
            Reserva tu Cancha Favorita
          </h1>
          <p className="complejo-description">
            Disfruta del mejor fútbol y pádel en instalaciones de primera calidad. Reserva fácil y rápido online.
          </p>
          <button className="complejo-reservar-btn">
            Reservar Ahora
          </button>
        </div>
      </section>

      */}

      {/* Main Content */}
      <main className="complejo-main">
        <div className="complejo-grid">
          {/* Calendar Section */}
          <div>
            <Calendar />
          </div>

          {/* Court Info Section */}
          <div>
            <ComplejoInfo />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
