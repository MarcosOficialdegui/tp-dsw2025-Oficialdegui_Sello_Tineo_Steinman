import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "./Home.css";

type Cancha = {
  tipoCancha: string;
  cantidad?: number;
};

type Complejo = {
  _id: string;
  nombre: string;
  direccion?: string;
  localidad?: string;
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
    buscarComplejos(filters); // Buscar complejos al iniciar la pagina 
  }, []);

  // useEffect para el carousel de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [heroImages.length]);  

  // recibe (name, value)
  const handleFilterChange = (name: keyof Filtros, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    console.log("Filtro actualizado:", name, value);
  };

  // Construye URL con params solo si tienen valor
  const buildUrl = (f: Filtros) => {
    const base = "http://localhost:3000/api/complejos";
    const params = new URLSearchParams();
    if (f.ciudad) params.append("ciudad", f.ciudad);
    if (f.tipoCancha) params.append("tipoCancha", f.tipoCancha);
    if (f.fecha) params.append("fecha", f.fecha); // si el backend lo usa
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const buscarComplejos = async (filtros: Filtros) => {
    console.log("Buscando con filtros:", filtros);
    setLoading(true);
    try {
      const url = buildUrl(filtros);
      console.log("Fetch URL:", url);
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        console.error("Error HTTP:", res.status, text);
        setComplejos([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      console.log("Recibidos:", data);
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
      <section 
        className="complejo-hero"
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`
        }}
      >
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

      <div className="home-container">
        <SearchBar 
          filters={filters} 
          onChange={handleFilterChange} 
          onSearch={() => buscarComplejos(filters)} 
        />

        <section className="complejos-section">
          <h2>Complejos disponibles</h2>
          {loading ? (
            <p className="loading-message">Cargando...</p>
          ) : complejos.length === 0 ? (
            <p className="no-results-message">No hay complejos cargados.</p>
          ) : (
            <ul className="complejos-list">
              {complejos.map((c) => (
                <li key={c._id} className="complejo-card">
                  <div className="complejo-card-content">
                    <div className="complejo-info">
                      <h3 className="complejo-name">{c.nombre}</h3>
                      <p className="complejo-detail">
                        📍 {c.localidad} — {c.direccion}
                      </p>
                      <p className="complejo-detail">
                        🏟️ Canchas: {c.canchas?.map(cc => cc.tipoCancha).join(", ") || "No especificado"}
                      </p>
                      {c.canchas && c.canchas.length > 0 && (
                        <p className="complejo-detail available">
                          ✅ {c.canchas.length} cancha{c.canchas.length !== 1 ? 's' : ''} disponible{c.canchas.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="complejo-actions">
                      <button 
                        onClick={() => handleVerComplejo(c._id)}
                        className="ver-complejo-btn"
                      >
                        Ver Complejo
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;

