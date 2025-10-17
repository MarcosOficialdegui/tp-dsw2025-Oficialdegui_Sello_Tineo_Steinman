import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ComplejoList from "../components/ComplejoList";
import { MdSort, MdFilterList } from "react-icons/md";
import "./Complejos.css";

type Filtros = {
  ciudad: string;
  tipoCancha: string;
  fecha: string;
};

type Cancha = {
  tipoCancha: string;
  cantidad?: number;
};

type Complejo = {
  _id: string;
  nombre: string;
  direccion?: string;
  ciudad?: {
    _id: string;
    nombre: string;
  };
  imagen?: string;
  canchas?: Cancha[];
};

type OrdenType = "nombre" | "ciudad" | "relevancia";

export default function Complejos() {
  const navigate = useNavigate();
  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [complejosFiltrados, setComplejosFiltrados] = useState<Complejo[]>([]);
  const [ordenActual, setOrdenActual] = useState<OrdenType>("relevancia");
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [filters, setFilters] = useState<Filtros>({
    ciudad: "",
    tipoCancha: "",
    fecha: "",
  });

  // Cargar todos los complejos al inicio
  useEffect(() => {
    const fetchComplejos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/complejos");
        if (response.ok) {
          const data = await response.json();
          setComplejos(data);
          setComplejosFiltrados(data);
        }
      } catch (error) {
        console.error("Error al cargar complejos:", error);
      }
    };

    fetchComplejos();
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (name: keyof Filtros, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Aplicar filtros de búsqueda
  const handleSearch = () => {
    let resultados = [...complejos];

    // Filtrar por ciudad
    if (filters.ciudad) {
      resultados = resultados.filter((complejo) =>
        complejo.ciudad?.nombre.toLowerCase().includes(filters.ciudad.toLowerCase())
      );
    }

    // Filtrar por tipo de cancha
    if (filters.tipoCancha) {
      resultados = resultados.filter((complejo) =>
        complejo.canchas?.some((cancha) => cancha.tipoCancha === filters.tipoCancha)
      );
    }

    setComplejosFiltrados(aplicarOrden(resultados, ordenActual));
  };

  // Aplicar ordenamiento
  const aplicarOrden = (lista: Complejo[], orden: OrdenType): Complejo[] => {
    const copia = [...lista];
    
    switch (orden) {
      case "nombre":
        return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case "ciudad":
        return copia.sort((a, b) => 
          (a.ciudad?.nombre || "").localeCompare(b.ciudad?.nombre || "")
        );
      case "relevancia":
      default:
        return copia;
    }
  };

  // Cambiar orden
  const handleOrdenChange = (nuevoOrden: OrdenType) => {
    setOrdenActual(nuevoOrden);
    setComplejosFiltrados(aplicarOrden(complejosFiltrados, nuevoOrden));
  };

  // Navegar al detalle del complejo
  const handleComplejoClick = (complejoId: string) => {
    navigate(`/complejo/${complejoId}`);
  };

  return (
    <div className="complejos-page">
      {/* Barra de búsqueda */}
      {mostrarFiltros && (
        <div className="search-section">
          <SearchBar
            filters={filters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>
      )}

      {/* Barra de controles */}
      <div className="controls-bar">
        <div className="controls-left">
          <button 
            className="filter-toggle"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <MdFilterList size={20} />
            {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
          
          <div className="results-count">
            <strong>{complejosFiltrados.length}</strong> {complejosFiltrados.length === 1 ? "complejo encontrado" : "complejos encontrados"}
            {filters.ciudad && ` en ${filters.ciudad}`}
          </div>
        </div>

        <div className="controls-right">
          <div className="sort-controls">
            <MdSort size={20} />
            <span className="sort-label">Ordenar:</span>
            <select 
              value={ordenActual} 
              onChange={(e) => handleOrdenChange(e.target.value as OrdenType)}
              className="sort-select"
            >
              <option value="relevancia">Relevancia</option>
              <option value="nombre">Nombre A-Z</option>
              <option value="ciudad">Ciudad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="divider"></div>

      {/* Lista de complejos */}
      <ComplejoList
        complejos={complejosFiltrados}
        onComplejoClick={handleComplejoClick}
        nombreLista=""
      />
    </div>
  );
}
