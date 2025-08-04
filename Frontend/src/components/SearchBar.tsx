import React from "react";
import styles from "./SearchBar.module.css";

type Props = {
  filters: {
    ciudad: string;
    tipoCancha: string;
    fecha: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSearch: () => void; 
};

const SearchBar: React.FC<Props> = ({ filters, onChange, onSearch }) => {
  return (
    <div className={styles.searchBar}>
      <select name="ciudad" value={filters.ciudad} onChange={onChange}>
        <option value="" disabled>📍Ciudad</option>
        <option value="Rosario">Rosario</option>
        <option value="Funes">Funes</option>
        <option value="Roldan">Roldan</option>
      </select>

      <select name="tipoCancha" value={filters.tipoCancha} onChange={onChange}>
        <option value="" disabled>🏃 Deporte</option>
        <option value="futbol5">⚽Fútbol 5</option>
        <option value="futbol7">⚽Fútbol 7</option>
        <option value="padel">🎾Pádel</option>
      </select>

      <input
        type="date"
        name="fecha"
        value={filters.fecha}
        onChange={onChange}
      />

      <button onClick={onSearch}>🔍 Buscar</button>
    </div>
  );
};

export default SearchBar;
