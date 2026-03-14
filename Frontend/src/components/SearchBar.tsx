import React, { useState, useEffect } from "react";
import styles from "./SearchBar.module.css";
import {
  MdSportsSoccer,
  MdSportsTennis,
  MdLocationOn,
  MdSearch
} from "react-icons/md";
import { Loader2 } from 'lucide-react';

type Ciudad = {
  _id: string;
  nombre: string;
};

type Filtros = {
  nombre: string;
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

  const getIconoDeporte = (deporte: string) => {
    switch (deporte) {
      case "Futbol 5":
      case "Futbol 7":
        return <MdSportsSoccer size={16} color="#4CAF50" />;
      case "Padel":
        return <MdSportsTennis size={16} color="#4CAF50" />;
      default:
        return <MdSportsSoccer size={16} color="#4CAF50" />;
    }
  };

  const deportes = [
    { value: "Futbol 5", label: "Fútbol 5", icon: getIconoDeporte("Futbol 5") },
    { value: "Futbol 7", label: "Fútbol 7", icon: getIconoDeporte("Futbol 7") },
    { value: "Padel", label: "Pádel", icon: getIconoDeporte("Padel") }
  ];

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

  const seleccionarCiudad = (ciudad: Ciudad) => {
    onChange("ciudad", ciudad.nombre);
    setMostrarSugerenciasCiudad(false);
  };

  const seleccionarDeporte = (deporte: string) => {
    onChange("tipoCancha", deporte);
    setMostrarSugerenciasDeporte(false);
  };

  const handleCiudadChange = (value: string) => {
    onChange("ciudad", value);
    if (value.length < 2) setMostrarSugerenciasCiudad(false);
  };

  const getDeporteLabel = () => {
    if (!filters.tipoCancha) return "Seleccionar deporte";
    const deporte = deportes.find(d => d.value === filters.tipoCancha);
    return deporte ? deporte.label : filters.tipoCancha;
  };

  return (
    <div className={styles.wrapper}>

      {/* Barra superior — nombre del complejo */}
      <div className={styles.nombreContainer}>
        <span className={styles.nombreIcon}>
          <MdSearch size={18} color="#4CAF50" />
        </span>
        <input
          className={styles.nombreInput}
          type="text"
          placeholder="Buscar por nombre del complejo..."
          value={filters.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        {filters.nombre && (
          <button
            className={styles.nombreClear}
            onClick={() => onChange("nombre", "")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Fila inferior — filtros */}
      <div className={styles.container}>

        {/* Ciudad */}
        <div className={styles.fieldContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Buscar ciudad"
            value={filters.ciudad}
            onChange={(e) => handleCiudadChange(e.target.value)}
            onFocus={() => filters.ciudad.length >= 2 && setMostrarSugerenciasCiudad(true)}
            onBlur={() => setTimeout(() => setMostrarSugerenciasCiudad(false), 200)}
          />
          {mostrarSugerenciasCiudad && (
            <div className={styles.dropdown}>
              {cargandoCiudades ? (
                <div className={`${styles.dropdownItem} ${styles.loading}`}>
                  <span className={styles.loadingIcon}><Loader2 size={16} /></span>
                  Cargando ciudades...
                </div>
              ) : ciudadesFiltradas.length > 0 ? (
                ciudadesFiltradas.map((ciudad) => (
                  <div
                    key={ciudad._id}
                    className={`${styles.dropdownItem} ${styles.clickable}`}
                    onClick={() => seleccionarCiudad(ciudad)}
                  >
                    <span className={styles.cityIcon}><MdLocationOn size={16} color="#4CAF50" /></span>
                    <span className={styles.cityName}>{ciudad.nombre}</span>
                  </div>
                ))
              ) : (
                <div className={`${styles.dropdownItem} ${styles.noResults}`}>
                  <span className={styles.searchIcon}><MdSearch size={16} color="#999" /></span>
                  No se encontraron ciudades con "{filters.ciudad}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deporte */}
        <div className={styles.fieldContainer}>
          <div
            className={`${styles.input} ${styles.selectInput}`}
            onClick={() => setMostrarSugerenciasDeporte(!mostrarSugerenciasDeporte)}
            tabIndex={0}
            onBlur={() => setTimeout(() => setMostrarSugerenciasDeporte(false), 200)}
          >
            <span className={styles.selectText}>{getDeporteLabel()}</span>
            <span className={`${styles.selectArrow} ${mostrarSugerenciasDeporte ? styles.open : ''}`}>▼</span>
          </div>
          {mostrarSugerenciasDeporte && (
            <div className={styles.dropdown}>
              <div
                className={`${styles.dropdownItem} ${styles.clickable} ${!filters.tipoCancha ? styles.selected : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => seleccionarDeporte("")}
              >
                <span className={styles.sportIcon}><MdSportsSoccer size={16} color="#4CAF50" /></span>
                <span className={styles.sportName}>Todos los deportes</span>
              </div>
              {deportes.map((deporte) => (
                <div
                  key={deporte.value}
                  className={`${styles.dropdownItem} ${styles.clickable} ${filters.tipoCancha === deporte.value ? styles.selected : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => seleccionarDeporte(deporte.value)}
                >
                  <span className={styles.sportIcon}>{deporte.icon}</span>
                  <span className={styles.sportName}>{deporte.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fecha */}
        <div className={styles.fieldContainer}>
          <input
            className={styles.input}
            type="date"
            value={filters.fecha}
            onChange={(e) => onChange("fecha", e.target.value)}
          />
        </div>

        {/* Botón */}
        <button className={styles.button} onClick={onSearch}>
          <MdSearch size={16} color="white" />
          Buscar
        </button>

      </div>

      
    </div>
  );
};

export default SearchBar;