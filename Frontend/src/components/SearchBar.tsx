import React from "react";
import styles from "./SearchBar.module.css";

type Props = {
  filters: {
    ciudad: string;
    deporte: string;
    fecha: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const SearchBar: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <div className={styles.searchBar}>
      <select name="ciudad" value={filters.ciudad} onChange={onChange}>
        <option value="" disabled>📍Ciudad</option>
        <option value="Rosario">Rosario</option>
        <option value="Córdoba">Córdoba</option>
        <option value="Buenos Aires">Buenos Aires</option>
      </select>

      <select name="deporte" value={filters.deporte} onChange={onChange}>
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
    </div>
  );
};

export default SearchBar;
