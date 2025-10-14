import React, { useState, useEffect } from "react";
import styles from "./SearchBar.module.css";

type Ciudad = {
  _id: string;
  nombre: string;
};

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
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<Ciudad[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);

  // Carga todas las ciudades al inicio, cuando se monta el componente
  useEffect(() => {
    const cargarCiudades = async () => {
      setCargandoCiudades(true);
      try {
        const response = await fetch('http://localhost:3000/api/ciudades');
        if (response.ok) {
          const data = await response.json();
          setCiudades(data);
        }
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
      } finally {
        setCargandoCiudades(false);
      }
    };
    
    cargarCiudades();
  }, []);

  // Filtra ciudades mientras el usuario escribe
  useEffect(() => {
    if (filters.ciudad.length >= 2) {
      const filtradas = ciudades.filter(ciudad =>
        ciudad.nombre.toLowerCase().includes(filters.ciudad.toLowerCase())
      );
      setCiudadesFiltradas(filtradas);
      setMostrarSugerencias(true);
    } else {
      setCiudadesFiltradas([]);
      setMostrarSugerencias(false);
    }
  }, [filters.ciudad, ciudades]); // se ejecuta cuando cambia el texto o las ciudades

  // Seleccionar una ciudad de las sugerencias
  const seleccionarCiudad = (ciudad: Ciudad) => {
    onChange("ciudad", ciudad.nombre);
    setMostrarSugerencias(false);
  };

  // Manejar cambio en el input de ciudad
  const handleCiudadChange = (value: string) => {
    onChange("ciudad", value);
    if (value.length < 2) {
      setMostrarSugerencias(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Campo de Ciudad con Autocompletado */}
      <div className={styles.ciudadContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="🌆 Buscar ciudad..."
          value={filters.ciudad}
          onChange={(e) => handleCiudadChange(e.target.value)}
          onFocus={() => filters.ciudad.length >= 2 && setMostrarSugerencias(true)}
          onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
        />
        
        {/* Menú desplegable de sugerencias */}
        {mostrarSugerencias && (
          <div className={styles.dropdown}>
            {cargandoCiudades ? (
              <div className={styles.dropdownItem + ' ' + styles.loading}>
                <span className={styles.loadingIcon}>⏳</span>
                Cargando ciudades...
              </div>
            ) : ciudadesFiltradas.length > 0 ? (
              ciudadesFiltradas.map((ciudad) => (
                <div
                  key={ciudad._id}
                  className={styles.dropdownItem + ' ' + styles.clickable}
                  onClick={() => seleccionarCiudad(ciudad)}
                >
                  <span className={styles.cityIcon}>📍</span>
                  <span className={styles.cityName}>{ciudad.nombre}</span>
                </div>
              ))
            ) : (
              <div className={styles.dropdownItem + ' ' + styles.noResults}>
                <span className={styles.searchIcon}>🔍</span>
                No se encontraron ciudades con "{filters.ciudad}"
              </div>
            )}
          </div>
        )}
      </div>

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

