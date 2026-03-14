import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ComplejoList from "../components/ComplejoList";
import { MdSort, MdFilterList, MdChevronLeft, MdChevronRight } from "react-icons/md";
import "./Complejos.css";


type Filtros = {
  nombre: string;
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
  const [ordenActual, setOrdenActual] = useState<OrdenType>("relevancia");
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [filters, setFilters] = useState<Filtros>({
    nombre: "",
    ciudad: "",
    tipoCancha: "",
    fecha: "",
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalComplejos, setTotalComplejos] = useState(0);

  const aplicarOrden = (lista: Complejo[], orden: OrdenType): Complejo[] => {
    const copia = [...lista];
    switch (orden) {
      case "nombre":
        return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case "ciudad":
        return copia.sort((a, b) =>
          (a.ciudad?.nombre || "").localeCompare(b.ciudad?.nombre || "")
        );
      default:
        return copia;
    }
  };

  const buscarComplejos = async (filtrosActuales: Filtros = filters, pagina: number = 1) => {
    try {
      const params = new URLSearchParams();
      if (filtrosActuales.nombre) params.append("nombre", filtrosActuales.nombre);
      if (filtrosActuales.ciudad) params.append("ciudad", filtrosActuales.ciudad);
      if (filtrosActuales.tipoCancha) params.append("tipoCancha", filtrosActuales.tipoCancha);
      params.append("page", pagina.toString());
      params.append("limit", "5");

      const res = await fetch(`http://localhost:3000/api/complejos?${params}`);
      if (!res.ok) throw new Error("Error al buscar complejos");

      const data = await res.json();
      setComplejos(aplicarOrden(data.complejos, ordenActual));
      setTotalPaginas(data.paginas);
      setTotalComplejos(data.total);
      setPaginaActual(pagina);
    } catch (error) {
      console.error("Error al buscar complejos:", error);
    }
  };

  useEffect(() => {
    buscarComplejos();
  }, []);

  const handleFilterChange = (name: keyof Filtros, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrdenChange = (nuevoOrden: OrdenType) => {
    setOrdenActual(nuevoOrden);
    setComplejos((prev) => aplicarOrden(prev, nuevoOrden));
  };

  const handleComplejoClick = (complejoId: string) => {
    navigate(`/complejo/${complejoId}`);
  };

  return (
    <div className="complejos-page">


      {mostrarFiltros && (
        <div className="search-section">
          <SearchBar
            filters={filters}
            onChange={handleFilterChange}
            onSearch={() => buscarComplejos(filters)}
          />
        </div>
      )}

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
            <strong>{totalComplejos}</strong>{" "}
            {totalComplejos === 1 ? "complejo encontrado" : "complejos encontrados"}
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

      <div className="divider"></div>

      <ComplejoList
        complejos={complejos}
        onComplejoClick={handleComplejoClick}
        nombreLista=""
      />

      <div className="pagination">
        <button
          onClick={() => buscarComplejos(filters, paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          <MdChevronLeft size={18} />
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
          <MdChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}