import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ComplejoList from "../components/ComplejoList.tsx";
import "./Home.css";
import ComplejoForm from "../components/ComplejoForm.tsx";

type Cancha = {
  tipoCancha: string;
  cantidad?: number;
};

type Complejo = {
  _id: string;
  nombre: string;
  direccion?: string;
  localidad?: string;
  imagen?: string;
  canchas?: Cancha[];
};

type Filtros = {
  ciudad: string;
  tipoCancha: string;
  fecha: string;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<Filtros>({
    ciudad: "",
    tipoCancha: "",
    fecha: "",
  });

  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "/images/vista-de-pelota-mirando-hacia-porteria.jpg",
    "/images/hombre-jugando-padel.jpg",
    "/images/campo-de-padel-con-pelotas-en-canasta.jpg",
    "/images/hombres-de-tiro-completo-jugando-al-futbol.jpg",
  ];

  useEffect(() => {
    buscarComplejos(filters); // buscar al inicio
  }, []);

  // Carousel de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % heroImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // actualizar filtros
  const handleFilterChange = (name: keyof Filtros, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // armar URL según filtros
  const buildUrl = (f: Filtros) => {
    const base = "http://localhost:3000/api/complejos";
    const params = new URLSearchParams();
    if (f.ciudad) params.append("ciudad", f.ciudad);
    if (f.tipoCancha) params.append("tipoCancha", f.tipoCancha);
    if (f.fecha) params.append("fecha", f.fecha);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  // fetch complejos
  const buscarComplejos = async (filtros: Filtros) => {
    setLoading(true);
    try {
      const url = buildUrl(filtros);
      const res = await fetch(url);
      if (!res.ok) {
        setComplejos([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setComplejos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al buscar complejos", error);
      setComplejos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para navegar a la página del complejo
  const handleVerComplejo = (complejoId: string) => {
    navigate(`/complejo/${complejoId}`);
  };

  return (
    <>
      {/* Hero con carousel */}
      <section
        className="complejo-hero"
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
        }}
      >
        <div className="complejo-hero-content">
          <h1 className="complejo-title">Reserva tu Cancha Favorita</h1>
          <p className="complejo-description">
            Disfruta del mejor fútbol y pádel en instalaciones de primera
            calidad. Reserva fácil y rápido online.
          </p>
          <button
            className="complejo-reservar-btn"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          >
            Reservar Ahora
          </button>
        </div>
      </section>

      {/* Contenido */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <SearchBar
          filters={filters}
          onChange={handleFilterChange}
          onSearch={() => buscarComplejos(filters)}
        />

        <section style={{ marginTop: 24 }}>
          {loading ? (
            <p className="loading-message">Cargando...</p>
          ) : complejos.length === 0 ? (
            <p className="no-results-message">No hay complejos cargados.</p>
          ) : (
            <ComplejoList
              complejos={complejos}
              onComplejoClick={handleVerComplejo}
            />
          )}
        </section>
        <ComplejoForm/>
      </div>
    </>
  );
};

export default Home;


