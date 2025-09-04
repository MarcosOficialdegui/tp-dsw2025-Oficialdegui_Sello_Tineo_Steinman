import React from "react";
import styles from "./SearchBar.module.css";

type Filtros = {
  ciudad: string;
  tipoCancha: string;
  fecha: string;
};

type Props = {
  filters: Filtros;
  onChange: (name: keyof Filtros, value: string) => void;
  onSearch: () => void;
};

const SearchBar: React.FC<Props> = ({ filters, onChange, onSearch }) => {
  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={filters.ciudad}
        onChange={(e) => onChange("ciudad", e.target.value)}
      >
        <option value="">🌆 Seleccionar ciudad</option>
        <option value="Rosario">Rosario</option>
        <option value="Buenos Aires">Buenos Aires</option>
        <option value="Córdoba">Córdoba</option>
      </select>

      <select
        className={styles.select}
        value={filters.tipoCancha}
        onChange={(e) => onChange("tipoCancha", e.target.value)}
      >
        <option value="">⚽ Seleccionar deporte</option>
        <option value="futbol5">Fútbol 5</option>
        <option value="futbol7">Fútbol 7</option>
        <option value="padel">Pádel</option>
      </select>

      <input
        className={styles.input}
        type="date"
        value={filters.fecha}
        onChange={(e) => onChange("fecha", e.target.value)}
      />

      <button className={styles.button} onClick={onSearch}>🔍 Buscar</button>
    </div>
  );
};

export default SearchBar;

