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
type Filtros = { nombre: string, ciudad: string; tipoCancha: string; fecha: string; };

const Home: React.FC = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const comoFuncionaRef = useRef<HTMLElement>(null);

  const [filters, setFilters] = useState<Filtros>({ nombre: "", ciudad: "", tipoCancha: "", fecha: "" });
  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mostrarPasos, setMostrarPasos] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalComplejos, setTotalComplejos] = useState(0);

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

  const buildUrl = (f: Filtros, pagina: number = 1) => {
    const base = "http://localhost:3000/api/complejos";
    const params = new URLSearchParams();
    if (f.nombre)     params.append("nombre", f.nombre);
    if (f.ciudad)     params.append("ciudad", f.ciudad);
    if (f.tipoCancha) params.append("tipoCancha", f.tipoCancha);
    params.append("page", pagina.toString());
    params.append("limit", "5");
    return `${base}?${params}`;
  };

  const buscarComplejos = async (filtros: Filtros, pagina: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(buildUrl(filtros, pagina));
      if (!res.ok) { setComplejos([]); return; }
      const data = await res.json();
      setComplejos(data.complejos ?? []);
      setTotalPaginas(data.paginas);
      setTotalComplejos(data.total);
      setPaginaActual(pagina);
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

        {totalPaginas > 1 && (
          <div className="pagination">
            <button
              onClick={() => buscarComplejos(filters, paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <div className="pagination-info">
              <strong>{paginaActual}</strong>
              <span>de</span>
              <strong>{totalPaginas}</strong>
            </div>
            <button
              onClick={() => buscarComplejos(filters, paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;