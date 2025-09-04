import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

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
  const [filters, setFilters] = useState<Filtros>({
    ciudad: "",
    tipoCancha: "",
    fecha: "",
  });

  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <SearchBar filters={filters} onChange={handleFilterChange} onSearch={() => buscarComplejos(filters)} />

      <section style={{ marginTop: 24 }}>
        <h2>Complejos disponibles</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : complejos.length === 0 ? (
          <p>No hay complejos cargados.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {complejos.map((c) => (
              <li key={c._id} style={{ border: "1px solid #e0e0e0", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>{c.nombre}</h3>
                <p style={{ margin: "6px 0" }}>{c.localidad} — {c.direccion}</p>
                <p style={{ margin: "6px 0" }}>Canchas: {c.canchas?.map(cc => cc.tipoCancha).join(", ") || "—"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;

