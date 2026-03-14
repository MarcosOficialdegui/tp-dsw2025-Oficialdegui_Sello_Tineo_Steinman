import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ComplejoList from "../components/ComplejoList.tsx";
import "./Home.css";

type Cancha = { tipoCancha: string; cantidad?: number; };
type Complejo = {
  _id: string; nombre: string; direccion?: string;
  ciudad?: { _id: string; nombre: string; };
  imagen?: string; canchas?: Cancha[];
};
type Filtros = { ciudad: string; tipoCancha: string; fecha: string; };

const Home: React.FC = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const comoFuncionaRef = useRef<HTMLElement>(null);

  const [filters, setFilters] = useState<Filtros>({ ciudad: "", tipoCancha: "", fecha: "" });
  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mostrarPasos, setMostrarPasos] = useState(false);

  const heroImages = [
    "/images/vista-de-pelota-mirando-hacia-porteria.jpg",
    "/images/hombre-jugando-padel.jpg",
    "/images/campo-de-padel-con-pelotas-en-canasta.jpg",
    "/images/hombres-de-tiro-completo-jugando-al-futbol.jpg",
  ];

  useEffect(() => { buscarComplejos(filters); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const section = comoFuncionaRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setMostrarPasos(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMostrarPasos(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleFilterChange = (name: keyof Filtros, value: string) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  const buildUrl = (f: Filtros) => {
    const base = "http://localhost:3000/api/complejos";
    const params = new URLSearchParams();
    if (f.ciudad) params.append("ciudad", f.ciudad);
    if (f.tipoCancha) params.append("tipoCancha", f.tipoCancha);
    if (f.fecha) params.append("fecha", f.fecha);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const buscarComplejos = async (filtros: Filtros) => {
    setLoading(true);
    try {
      const res = await fetch(buildUrl(filtros));
      if (!res.ok) { setComplejos([]); return; }
      const data = await res.json();
      setComplejos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setComplejos([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSearch = () =>
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const scrollToComoFunciona = () =>
    comoFuncionaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const pasos = [
    { numero: "01", icono: "🔍", titulo: "Buscá tu cancha", descripcion: "Filtrá por ciudad, deporte y fecha para encontrar el complejo ideal." },
    { numero: "02", icono: "📅", titulo: "Elegí un horario", descripcion: "Visualizá turnos disponibles en tiempo real y elegí el que mejor te quede." },
    { numero: "03", icono: "✅", titulo: "Confirmá tu reserva", descripcion: "Con un clic quedás reservado. Sin llamadas, sin esperas." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        {heroImages.map((img, i) => (
          <div
            key={img}
            className={`hero-bg ${i === currentImageIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* El overlay oscuro */}
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-eyebrow">⚽ Reservas online · Fútbol y Pádel</span>
          <h1 className="hero-title">
            Tu cancha,<br /><span>cuando quieras.</span>
          </h1>
          <p className="hero-description">
            Encontrá y reservá canchas en los mejores complejos deportivos. Rápido, fácil y sin llamadas.
          </p>
          <div className="hero-actions">
            <button className="hero-reservar-btn" onClick={scrollToSearch}>
              Buscar cancha
            </button>
            <button className="hero-scroll-btn" onClick={scrollToComoFunciona}>
              ¿Cómo funciona?
            </button>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section ref={comoFuncionaRef} className={`como-funciona ${mostrarPasos ? "is-visible" : ""}`}>
        <div className="como-funciona-inner">
          <p className="como-funciona-label">Simple y rápido</p>
          <h2 className="como-funciona-titulo">¿Cómo funciona?</h2>
          <p className="como-funciona-sub">Reservar tu cancha nunca fue tan fácil. Solo tres pasos.</p>
          <div className="pasos-grid">
            {pasos.map((paso, i) => (
              <div key={i} className="paso-card">
                <span className="paso-numero">{paso.numero}</span>
                <div className="paso-icono-wrap">{paso.icono}</div>
                <h3 className="paso-titulo">{paso.titulo}</h3>
                <p className="paso-descripcion">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buscador + complejos */}
      <div ref={searchRef} className="home-container">
        <SearchBar
          filters={filters}
          onChange={handleFilterChange}
          onSearch={() => buscarComplejos(filters)}
        />
        <section style={{ marginTop: "2rem" }}>
          {loading ? (
            <p className="loading-message">Cargando complejos...</p>
          ) : complejos.length === 0 ? (
            <p className="no-results-message">No se encontraron complejos.</p>
          ) : (
            <ComplejoList
              complejos={complejos}
              onComplejoClick={(id) => navigate(`/complejo/${id}`)}
              nombreLista="Complejos disponibles"
            />
          )}
        </section>
      </div>
    </>
  );
};

export default Home;