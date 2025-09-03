import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

type Cancha = {
  _id: string;
  tipoCancha: string;
  precioHora: number;
};

type Complejo = {
  _id: string;
  nombre: string;
  direccion: string;
  localidad: string;
  canchas: Cancha[];
};

const Home = () => {
  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplejos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/complejos");
        const data = await res.json();
        setComplejos(data);
      } catch (error) {
        console.error("Error al traer complejos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplejos();
  }, []);

  return (
    <div>
      <SearchBar
        filters={{ ciudad: "", tipoCancha: "", fecha: "" }}
        onChange={() => {}}
        onSearch={() => {}}
      />

      <div>
        <h2>Complejos disponibles:</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : complejos.length === 0 ? (
          <p>No hay complejos cargados.</p>
        ) : (
          <ul>
            {complejos.map((c) => (
              <li key={c._id}>
                <h3>{c.nombre}</h3>
                <p>📍 {c.localidad} – {c.direccion}</p>
                <p>
                  Canchas:{" "}
                  {c.canchas.map((cancha) => cancha.tipoCancha).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
