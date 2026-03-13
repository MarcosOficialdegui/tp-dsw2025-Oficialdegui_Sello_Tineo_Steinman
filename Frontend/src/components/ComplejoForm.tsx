import { useEffect, useState } from "react";
import styles from "./ComplejoForm.module.css";
import { MapPin, Plus, Lightbulb, Loader2, Camera } from 'lucide-react';
import { mostrarExito, mostrarError, mostrarAdvertencia } from "../utils/notificaciones";

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
    horarioApertura: "08:00",
    horarioCierre: "22:00",
  });

  const [servicios, setServicios] = useState<string[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);

  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<Ciudad[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);
  const [creandoCiudad, setCreandoCiudad] = useState(false);

  // Estados para el manejo de imágenes
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);
  const [previsualizacion, setPrevisualizacion] = useState<string>(""); // Data URL para previsualización

  const [canchas, setCanchas] = useState([
    { tipoCancha: "Fútbol 5", precioHora: "", disponible: true },
  ]);

  useEffect(() => {
    fetch("http://localhost:3000/api/complejos/servicios")
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(() => mostrarError("Error al cargar los servicios"));
  }, []);

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

  const seleccionarCiudad = (ciudad: Ciudad) => {
    setFormData({ ...formData, ciudad: ciudad.nombre, ciudadId: ciudad._id });
    setMostrarSugerencias(false);
  };

  const handleCiudadChange = (value: string) => {
    const ciudadExacta = ciudades.find(
      ciudad => ciudad.nombre.toLowerCase() === value.toLowerCase()
    );
    setFormData({
      ...formData,
      ciudad: value,
      ciudadId: ciudadExacta ? ciudadExacta._id : ""
    });
    if (value.length < 2) setMostrarSugerencias(false);
  };

  const crearNuevaCiudad = async (nombreCiudad: string) => {
    setCreandoCiudad(true);
    try {
      const response = await fetch('http://localhost:3000/api/ciudades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ nombre: nombreCiudad, creadaPor: 'propietario' }),
      });
      const data = await response.json();
      if (response.ok) {
        const nuevaCiudad = data.ciudad;
        setCiudades(prev => [...prev, nuevaCiudad]);
        setFormData({ ...formData, ciudad: nuevaCiudad.nombre, ciudadId: nuevaCiudad._id });
        setMostrarSugerencias(false);
        mostrarExito(`Ciudad "${nuevaCiudad.nombre}" creada exitosamente`);
        return nuevaCiudad;
      } else {
        mostrarError(data.error || "Error al crear la ciudad");
        return null;
      }
    } catch (error) {
      console.error('Error al crear ciudad:', error);
      mostrarError("Error de conexión al crear la ciudad");
      return null;
    } finally {
      setCreandoCiudad(false);
    }
  };

  const handleServicioChange = (servicio: string) => {
    setServiciosSeleccionados(prev =>
      prev.includes(servicio) ? prev.filter(s => s !== servicio) : [...prev, servicio]
    );
  };

  // Manejar selección de imagen
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        mostrarError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        mostrarError('La imagen no debe superar los 5MB');
        return;
      }

      setImagenSeleccionada(file);
      
      // Crear previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrevisualizacion(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen seleccionada
  const eliminarImagen = () => {
    setImagenSeleccionada(null);
    setPrevisualizacion("");
  };
  const agregarCancha = () => {
    setCanchas([...canchas, { tipoCancha: "Fútbol 5", precioHora: "", disponible: true }]);
  };

  const eliminarCancha = (index: number) => {
    setCanchas(canchas.filter((_, i) => i !== index));
  };

  const actualizarCancha = (index: number, campo: string, valor: any) => {
    const nuevasCanchas = [...canchas];
    (nuevasCanchas[index] as any)[campo] = valor;
    setCanchas(nuevasCanchas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que apertura sea antes que cierre
    const [hApertura] = formData.horarioApertura.split(":").map(Number);
    const [hCierre] = formData.horarioCierre.split(":").map(Number);
    if (hApertura >= hCierre) {
      mostrarError("El horario de apertura debe ser anterior al de cierre");
      return;
    }

    let ciudadFinal = formData.ciudadId;

    if (!formData.ciudadId && formData.ciudad.trim()) {
      const ciudadExacta = ciudades.find(
        ciudad => ciudad.nombre.toLowerCase() === formData.ciudad.trim().toLowerCase()
      );
      if (ciudadExacta) {
        ciudadFinal = ciudadExacta._id;
        setFormData({ ...formData, ciudadId: ciudadExacta._id });
      } else {
        const confirmar = confirm(`La ciudad "${formData.ciudad}" no existe. ¿Desea crearla?`);
        if (confirmar) {
          const nuevaCiudad = await crearNuevaCiudad(formData.ciudad.trim());
          if (nuevaCiudad) {
            ciudadFinal = nuevaCiudad._id;
          } else {
            return;
          }
        } else {
          mostrarAdvertencia("Debe seleccionar una ciudad existente o crear una nueva");
          return;
        }
      }
    }

    if (!ciudadFinal) {
      mostrarAdvertencia("Debe seleccionar una ciudad");
      return;
    }

    // Crear FormData para enviar datos con imagen
    const formDataToSend = new FormData();
    formDataToSend.append('nombre', formData.nombre);
    formDataToSend.append('direccion', formData.direccion);
    formDataToSend.append('ciudad', ciudadFinal);
    formDataToSend.append('servicios', JSON.stringify(serviciosSeleccionados));
    formDataToSend.append('horarioApertura', formData.horarioApertura);
    formDataToSend.append('horarioCierre', formData.horarioCierre);
    formDataToSend.append('canchas', JSON.stringify(canchas.map(c => ({
      tipoCancha: c.tipoCancha,
      precioHora: Number(c.precioHora),
      disponible: c.disponible,
    }))));

    // Agregar imagen si se seleccionó una
    if (imagenSeleccionada) {
      formDataToSend.append('imagen', imagenSeleccionada);
    }
    // Agregar imagen si se seleccionó una
    if (imagenSeleccionada) {
      formDataToSend.append('imagen', imagenSeleccionada);
    }

    try {
      const res = await fetch("http://localhost:3000/api/complejos", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        mostrarExito("Complejo creado con éxito");
        setFormData({ nombre: "", direccion: "", ciudad: "", ciudadId: "", horarioApertura: "08:00", horarioCierre: "22:00" });
        setServiciosSeleccionados([]);
        setCanchas([{ tipoCancha: "Fútbol 5", precioHora: "", disponible: true }]);
        setImagenSeleccionada(null);
        setPrevisualizacion("");
        setImagenSeleccionada(null);
        setPrevisualizacion("");
        window.location.reload();
      } else {
        mostrarError(data.error || "Error al crear el complejo");
      }
    } catch {
      mostrarError("Error de conexión con el servidor");
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

        {/* Ciudad */}
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
          {mostrarSugerencias && (
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
                    <span className={styles.cityIcon}><MapPin size={16} /></span>
                    <span className={styles.cityName}>{ciudad.nombre}</span>
                  </div>
                ))
              ) : formData.ciudad.trim().length >= 2 ? (
                <div className={`${styles.dropdownItem} ${styles.createOption}`}>
                  <div className={styles.createButton} onClick={() => crearNuevaCiudad(formData.ciudad.trim())}>
                    <span className={styles.createIcon}><Plus size={16} /></span>
                    <span className={styles.createText}>
                      Crear "{formData.ciudad}"{creandoCiudad && " (Creando...)"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={`${styles.dropdownItem} ${styles.hint}`}>
                  <span className={styles.hintIcon}><Lightbulb size={16} /></span>
                  Escribe al menos 2 caracteres para buscar
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección de carga de imagen */}
        <div className={styles.imagenContainer}>
          <label className={styles.imagenLabel}>Imagen del complejo (opcional)</label>
          
          {previsualizacion ? (
            <div className={styles.previsualizacionContainer}>
              <img 
                src={previsualizacion} 
                alt="Previsualización" 
                className={styles.previsualizacion}
              />
              <button 
                type="button" 
                onClick={eliminarImagen}
                className={styles.eliminarImagenBtn}
              >
                Cambiar imagen
              </button>
            </div>
          ) : (
            <div className={styles.uploadContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className={styles.inputFile}
                id="imagen-upload"
              />
              <label htmlFor="imagen-upload" className={styles.uploadLabel}>
                <span className={styles.uploadIcon}>
                  <Camera size={48} strokeWidth={1.5} />
                </span>
                <span className={styles.uploadText}>Seleccionar imagen</span>
                <span className={styles.uploadHint}>JPG, PNG, GIF o WEBP (máx. 5MB)</span>
              </label>
            </div>
          )}
        </div>

        {/* Horarios */}
        <h3 className={styles.subtitulo}>Horario de atención</h3>
        <div className={styles.canchaCampos}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.82rem", color: "#666", marginBottom: 4 }}>
              Apertura
            </label>
            <input
              className={styles.input}
              type="time"
              value={formData.horarioApertura}
              onChange={e => setFormData({ ...formData, horarioApertura: e.target.value })}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.82rem", color: "#666", marginBottom: 4 }}>
              Cierre
            </label>
            <input
              className={styles.input}
              type="time"
              value={formData.horarioCierre}
              onChange={e => setFormData({ ...formData, horarioCierre: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Sección de carga de imagen */}
        <div className={styles.imagenContainer}>
          <label className={styles.imagenLabel}>Imagen del complejo (opcional)</label>
          
          {previsualizacion ? (
            <div className={styles.previsualizacionContainer}>
              <img 
                src={previsualizacion} 
                alt="Previsualización" 
                className={styles.previsualizacion}
              />
              <button 
                type="button" 
                onClick={eliminarImagen}
                className={styles.eliminarImagenBtn}
              >
                Cambiar imagen
              </button>
            </div>
          ) : (
            <div className={styles.uploadContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className={styles.inputFile}
                id="imagen-upload"
              />
              <label htmlFor="imagen-upload" className={styles.uploadLabel}>
                <span className={styles.uploadIcon}>
                  <Camera size={48} strokeWidth={1.5} />
                </span>
                <span className={styles.uploadText}>Seleccionar imagen</span>
                <span className={styles.uploadHint}>JPG, PNG, GIF o WEBP (máx. 5MB)</span>
              </label>
            </div>
          )}
        </div>

        {/* Canchas */}
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
              <button type="button" onClick={() => eliminarCancha(index)} className={styles.eliminarBtn}>
                Eliminar
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={agregarCancha} className={styles.agregarBtn}>
          + Agregar otra cancha
        </button>

        {/* Servicios */}
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