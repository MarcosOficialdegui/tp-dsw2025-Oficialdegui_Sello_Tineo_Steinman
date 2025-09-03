import React from "react";
import styles from "./SearchBar.module.css";

type Filtros = {
  ciudad: string;
  tipoCancha: string;
  fecha: string;
};

type SearchBarProps = {
  filters: Filtros;
  onChange: (name: keyof Filtros, value: string) => void;
  onSearch: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ filters, onChange, onSearch }) => {
  return (
    <div className={styles.container}>
      {/* Ciudad */}
      <select
        value={filters.ciudad}
        onChange={(e) => onChange("ciudad", e.target.value)}
        className={styles.select}
      >
        <option value="">🌆 Seleccionar ciudad</option>
        <option value="Rosario">Rosario</option>
        <option value="Buenos Aires">Buenos Aires</option>
        <option value="Córdoba">Córdoba</option>
      </select>

      {/* Tipo de Cancha */}
      <select
        value={filters.tipoCancha}
        onChange={(e) => onChange("tipoCancha", e.target.value)}
        className={styles.select}
      >
        <option value="">⚽ Seleccionar deporte</option>
        <option value="futbol5">Fútbol 5</option>
        <option value="futbol7">Fútbol 7</option>
        <option value="padel">Pádel</option>
        <option value="tenis">Tenis</option>
      </select>

      {/* Fecha */}
      <input
        type="date"
        value={filters.fecha}
        onChange={(e) => onChange("fecha", e.target.value)}
        className={styles.input}
      />

      {/* Botón de búsqueda */}
      <button onClick={onSearch} className={styles.button}>
        🔍 Buscar
      </button>
    </div>
  );
};

export default SearchBar;
