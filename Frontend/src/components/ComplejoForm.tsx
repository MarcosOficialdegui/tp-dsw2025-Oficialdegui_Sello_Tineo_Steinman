import { useEffect, useState } from "react";
import styles from "./ComplejoForm.module.css";

export default function ComplejoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
  });

  const [servicios, setServicios] = useState<string[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);

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

    const body = {
      nombre: formData.nombre,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Complejo creado con éxito");
        setFormData({ nombre: "", direccion: "", ciudad: "" });
        setServiciosSeleccionados([]);
        setCanchas([{ tipoCancha: "Fútbol 5", precioHora: "", disponible: true }]);
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

        <input
          className={styles.input}
          type="text"
          placeholder="Ciudad"
          value={formData.ciudad}
          onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
          required
        />

        <h3 className={styles.subtitulo}>Canchas</h3>

        {canchas.map((cancha, index) => (
          <div key={index} className={styles.canchaCard}>
            <div className={styles.canchaCampos}>
              <select
                className={styles.select}
                value={cancha.tipoCancha}
                onChange={e => actualizarCancha(index, "tipoCancha", e.target.value)}
              >
                <option value="Fútbol 5">Fútbol 5</option>
                <option value="Fútbol 7">Fútbol 7</option>
                <option value="Pádel">Pádel</option>
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