import { useEffect, useState } from "react";
import styles from "./ComplejoForm.module.css";

type Ciudad = {
  _id: string;
  nombre: string;
};

export default function ComplejoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    ciudadId: "",
  });

  const [servicios, setServicios] = useState<string[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);

  // Estados para el manejo de ciudades
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<Ciudad[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);
  const [creandoCiudad, setCreandoCiudad] = useState(false);

  const [canchas, setCanchas] = useState([
    { tipoCancha: "Fútbol 5", precioHora: "", disponible: true },
  ]);

  // 🔄 Traer servicios desde el backend
  useEffect(() => {
    fetch("http://localhost:3000/api/complejos/servicios")
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(() => alert("Error al cargar los servicios"));
  }, []);

  // 🔄 Cargar ciudades al inicio
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

  // 🔍 Filtrar ciudades mientras el usuario escribe
  useEffect(() => {
    if (formData.ciudad.length >= 2) {
      const filtradas = ciudades.filter(ciudad =>
        ciudad.nombre.toLowerCase().includes(formData.ciudad.toLowerCase())
      );
      setCiudadesFiltradas(filtradas);
      setMostrarSugerencias(true);
    } else {
      setCiudadesFiltradas([]);
      setMostrarSugerencias(false);
    }
  }, [formData.ciudad, ciudades]);

  // 🎯 Seleccionar una ciudad existente
  const seleccionarCiudad = (ciudad: Ciudad) => {
    setFormData({
      ...formData,
      ciudad: ciudad.nombre,
      ciudadId: ciudad._id
    });
    setMostrarSugerencias(false);
  };

  // 📝 Manejar cambio en el input de ciudad
  const handleCiudadChange = (value: string) => {
    setFormData({
      ...formData,
      ciudad: value,
      ciudadId: "" // Limpiar ID cuando se cambia el texto
    });
    if (value.length < 2) {
      setMostrarSugerencias(false);
    }
  };

  // ➕ Crear nueva ciudad
  const crearNuevaCiudad = async (nombreCiudad: string) => {
    setCreandoCiudad(true);
    try {
      const response = await fetch('http://localhost:3000/api/ciudades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreCiudad,
          creadaPor: 'propietario'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const nuevaCiudad = data.ciudad;
        // Agregar la nueva ciudad a la lista
        setCiudades(prev => [...prev, nuevaCiudad]);
        
        // Seleccionar automáticamente la nueva ciudad
        setFormData({
          ...formData,
          ciudad: nuevaCiudad.nombre,
          ciudadId: nuevaCiudad._id
        });
        
        setMostrarSugerencias(false);
        alert(`✅ Ciudad "${nuevaCiudad.nombre}" creada exitosamente`);
        return nuevaCiudad;
      } else {
        alert(data.error || "Error al crear la ciudad");
        return null;
      }
    } catch (error) {
      console.error('Error al crear ciudad:', error);
      alert("Error de conexión al crear la ciudad");
      return null;
    } finally {
      setCreandoCiudad(false);
    }
  };

  // 🧠 Manejar selección de servicios
  const handleServicioChange = (servicio: string) => {
    setServiciosSeleccionados(prev =>
      prev.includes(servicio)
        ? prev.filter(s => s !== servicio)
        : [...prev, servicio]
    );
  };

  // ➕ Agregar cancha
  const agregarCancha = () => {
    setCanchas([...canchas, { tipoCancha: "Fútbol 5", precioHora: "", disponible: true }]);
  };

  // ❌ Eliminar cancha
  const eliminarCancha = (index: number) => {
    setCanchas(canchas.filter((_, i) => i !== index));
  };

  // ✏️ Actualizar datos de una cancha específica
  const actualizarCancha = (index: number, campo: string, valor: any) => {
    const nuevasCanchas = [...canchas];
    (nuevasCanchas[index] as any)[campo] = valor;
    setCanchas(nuevasCanchas);
  };

  // 📤 Enviar al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let ciudadFinal = formData.ciudadId;

    // Si no hay ciudad seleccionada pero hay texto, ofrecer crear nueva
    if (!formData.ciudadId && formData.ciudad.trim()) {
      const confirmar = confirm(`La ciudad "${formData.ciudad}" no existe. ¿Desea crearla?`);
      if (confirmar) {
        const nuevaCiudad = await crearNuevaCiudad(formData.ciudad.trim());
        if (nuevaCiudad) {
          ciudadFinal = nuevaCiudad._id;
        } else {
          return;
        }
      } else {
        alert("Debe seleccionar una ciudad existente o crear una nueva");
        return;
      }
    }

    if (!ciudadFinal) {
      alert("Debe seleccionar una ciudad");
      return;
    }

    const body = {
      nombre: formData.nombre,
      direccion: formData.direccion,
      ciudad: ciudadFinal,
      servicios: serviciosSeleccionados,
      canchas: canchas.map(c => ({
        tipoCancha: c.tipoCancha,
        precioHora: Number(c.precioHora),
        disponible: c.disponible,
      })),

    };

    try {
      const res = await fetch("http://localhost:3000/api/complejos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Complejo creado con éxito");
        setFormData({ nombre: "", direccion: "", ciudad: "", ciudadId: "" });
        setServiciosSeleccionados([]);
        setCanchas([{ tipoCancha: "Fútbol 5", precioHora: "", disponible: true }]);
        window.location.reload();
      } else {
        alert(data.error || "Error al crear el complejo");
      }
    } catch {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.mainContent} onSubmit={handleSubmit}>
        <h1 className={styles.titulo}>Registrar Complejo</h1>

        <input
          className={styles.input}
          type="text"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          required
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={e => setFormData({ ...formData, direccion: e.target.value })}
          required
        />

        <div className={styles.ciudadContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Buscar o crear ciudad"
            value={formData.ciudad}
            onChange={e => handleCiudadChange(e.target.value)}
            onFocus={() => formData.ciudad.length >= 2 && setMostrarSugerencias(true)}
            onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
            required
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
              ) : formData.ciudad.trim().length >= 2 ? (
                <div className={styles.dropdownItem + ' ' + styles.createOption}>
                  <div
                    className={styles.createButton}
                    onClick={() => crearNuevaCiudad(formData.ciudad.trim())}
                  >
                    <span className={styles.createIcon}>➕</span>
                    <span className={styles.createText}>
                      Crear "{formData.ciudad}"
                      {creandoCiudad && " (Creando...)"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.dropdownItem + ' ' + styles.hint}>
                  <span className={styles.hintIcon}>💡</span>
                  Escribe al menos 2 caracteres para buscar
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className={styles.subtitulo}>Canchas</h3>

        {canchas.map((cancha, index) => (
          <div key={index} className={styles.canchaCard}>
            <div className={styles.canchaCampos}>
              <select
                className={styles.select}
                value={cancha.tipoCancha}
                onChange={e => actualizarCancha(index, "tipoCancha", e.target.value)}
              >
                <option value="futbol5">Fútbol 5</option>
                <option value="futbol7">Fútbol 7</option>
                <option value="padel">Pádel</option>
              </select>

              <input
                className={styles.inputSmall}
                type="number"
                placeholder="Precio por hora"
                value={cancha.precioHora}
                onChange={e => actualizarCancha(index, "precioHora", e.target.value)}
                required
              />

              <label className={styles.disponibleCheck}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={cancha.disponible}
                  onChange={e => actualizarCancha(index, "disponible", e.target.checked)}
                />
                Disponible
              </label>
            </div>

            {canchas.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarCancha(index)}
                className={styles.eliminarBtn}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={agregarCancha} className={styles.agregarBtn}>
          + Agregar otra cancha
        </button>

        <h3 className={styles.subtitulo}>Servicios disponibles</h3>
        <div className={styles.serviciosContainer}>
          {servicios.map((servicio) => (
            <label key={servicio} className={styles.servicioItem}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={serviciosSeleccionados.includes(servicio)}
                onChange={() => handleServicioChange(servicio)}
              />
              <span className={styles.servicioLabel}>{servicio}</span>
            </label>
          ))}
        </div>

        <button type="submit" className={styles.button}>Guardar Complejo</button>
      </form>
    </div>
  );
}