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
  const [mostrarSugerenciasCiudad, setMostrarSugerenciasCiudad] = useState(false);
  const [mostrarSugerenciasDeporte, setMostrarSugerenciasDeporte] = useState(false);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);

  // Opciones de deportes
  const deportes = [
    { value: "Futbol 5", label: "⚽ Fútbol 5", icon: "⚽" },
    { value: "Futbol 7", label: "⚽ Fútbol 7", icon: "⚽" },
    { value: "Padel", label: "🏓 Pádel", icon: "🏓" }
  ];

  // Carga todas las ciudades al inicio
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
      setMostrarSugerenciasCiudad(true);
    } else {
      setCiudadesFiltradas([]);
      setMostrarSugerenciasCiudad(false);
    }
  }, [filters.ciudad, ciudades]);

  // Seleccionar una ciudad
  const seleccionarCiudad = (ciudad: Ciudad) => {
    onChange("ciudad", ciudad.nombre);
    setMostrarSugerenciasCiudad(false);
  };

  // Seleccionar un deporte
  const seleccionarDeporte = (deporte: string) => {
    onChange("tipoCancha", deporte);
    setMostrarSugerenciasDeporte(false);
  };

  // Manejar cambio en el input de ciudad
  const handleCiudadChange = (value: string) => {
    onChange("ciudad", value);
    if (value.length < 2) {
      setMostrarSugerenciasCiudad(false);
    }
  };

  // Obtener el label del deporte seleccionado
  const getDeporteLabel = () => {
    if (!filters.tipoCancha) return "⚽ Seleccionar deporte";
    const deporte = deportes.find(d => d.value === filters.tipoCancha);
    return deporte ? deporte.label : filters.tipoCancha;
  };

  return (
    <div className={styles.container}>
      {/* Campo de Ciudad con Autocompletado */}
      <div className={styles.fieldContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="🌆 Buscar ciudad..."
          value={filters.ciudad}
          onChange={(e) => handleCiudadChange(e.target.value)}
          onFocus={() => filters.ciudad.length >= 2 && setMostrarSugerenciasCiudad(true)}
          onBlur={() => setTimeout(() => setMostrarSugerenciasCiudad(false), 200)}
        />
        
        {/* Dropdown de ciudades */}
        {mostrarSugerenciasCiudad && (
          <div className={styles.dropdown}>
            {cargandoCiudades ? (
              <div className={`${styles.dropdownItem} ${styles.loading}`}>
                <span className={styles.loadingIcon}>⏳</span>
                Cargando ciudades...
              </div>
            ) : ciudadesFiltradas.length > 0 ? (
              ciudadesFiltradas.map((ciudad) => (
                <div
                  key={ciudad._id}
                  className={`${styles.dropdownItem} ${styles.clickable}`}
                  onClick={() => seleccionarCiudad(ciudad)}
                >
                  <span className={styles.cityIcon}>📍</span>
                  <span className={styles.cityName}>{ciudad.nombre}</span>
                </div>
              ))
            ) : (
              <div className={`${styles.dropdownItem} ${styles.noResults}`}>
                <span className={styles.searchIcon}>🔍</span>
                No se encontraron ciudades con "{filters.ciudad}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Campo de Deporte con Dropdown */}
      <div className={styles.fieldContainer}>
        <div
          className={`${styles.input} ${styles.selectInput}`}
          onClick={() => setMostrarSugerenciasDeporte(!mostrarSugerenciasDeporte)}
          tabIndex={0} // 👈 Hace que sea focuseable
          onKeyDown={(e) => { // 👈 Manejo de teclado
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMostrarSugerenciasDeporte(!mostrarSugerenciasDeporte);
            }
          }}
        >
          <span className={styles.selectText}>{getDeporteLabel()}</span>
          <span className={`${styles.selectArrow} ${mostrarSugerenciasDeporte ? styles.open : ''}`}>
            ▼
          </span>
        </div>

        {/* Dropdown de deportes */}
        {mostrarSugerenciasDeporte && (
          <div className={styles.dropdown}>
            <div
              className={`${styles.dropdownItem} ${styles.clickable} ${!filters.tipoCancha ? styles.selected : ''}`}
              onMouseDown={(e) => e.preventDefault()} // 👈 Previene blur antes del click
              onClick={() => seleccionarDeporte("")}
            >
              <span className={styles.sportIcon}>⚽</span>
              <span className={styles.sportName}>Todos los deportes</span>
            </div>
            {deportes.map((deporte) => (
              <div
                key={deporte.value}
                className={`${styles.dropdownItem} ${styles.clickable} ${filters.tipoCancha === deporte.value ? styles.selected : ''}`}
                onMouseDown={(e) => e.preventDefault()} // 👈 Previene blur antes del click
                onClick={() => seleccionarDeporte(deporte.value)}
              >
                <span className={styles.sportIcon}>{deporte.icon}</span>
                <span className={styles.sportName}>{deporte.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campo de Fecha */}
      <div className={styles.fieldContainer}>
        <input
          className={styles.input}
          type="date"
          value={filters.fecha}
          onChange={(e) => onChange("fecha", e.target.value)}
          placeholder="📅 Seleccionar fecha"
        />
      </div>

      {/* Botón de Búsqueda */}
      <button className={styles.button} onClick={onSearch}>
        🔍 Buscar
      </button>
    </div>
  );
};

export default SearchBar;

