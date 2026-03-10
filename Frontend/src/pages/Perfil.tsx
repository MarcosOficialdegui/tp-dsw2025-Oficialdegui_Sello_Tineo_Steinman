import "./Perfil.css";
import { useState, useEffect } from "react";
import { mostrarExito, mostrarError } from "../utils/notificaciones";

interface Reserva {
  _id: string;
  user: string;
  complejo: string;
  canchaId: string;
  canchaTipo: string;
  fecha: Date;
  horaInicio: string;
  creadoEn: Date;
}

interface ReservaConNombre extends Reserva {
  nombreComplejo?: string;
}

interface User {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  reservas?: Reserva[];
}

const Perfil = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [reservasUser, setReservasUser] = useState<Reserva[]>([]);
  const [reservasFinales, setReservasFinales] = useState<ReservaConNombre[]>([]);
  const [cancelando, setCancelando] = useState<string | null>(null);

  useEffect(() => {
    const llamarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return;
        }

        const res = await fetch("http://localhost:3000/api/usuarios/perfil", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return;
        }

        const data = await res.json();
        setUserData(data);

        try {
          const reservasRes = await fetch("http://localhost:3000/api/reservas/mis-reservas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          setReservasUser(await reservasRes.json());
        } catch (error) {
          console.error("No se pudieron obtener las reservas del usuario", error);
        }

      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    llamarDatos();
  }, []);

  const buscarNombreComplejo = async (complejoId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/complejos/${complejoId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        return data.nombre || "Nombre no disponible";
      }
    } catch (error) {
      console.error("Error al obtener el nombre del complejo:", error);
    }
  };

  useEffect(() => {
    if (reservasUser.length > 0) {
      const obtenerNombresYProcesar = async () => {
        const promesasNombres = reservasUser.map(r => buscarNombreComplejo(r.complejo));
        const nombresResueltos = await Promise.all(promesasNombres);
        const reservasProcesadas: ReservaConNombre[] = reservasUser.map((r, index) => ({
          ...r,
          nombreComplejo: nombresResueltos[index],
        }));
        setReservasFinales(reservasProcesadas);
      };
      obtenerNombresYProcesar();
    } else if (reservasUser.length === 0 && userData) {
      setReservasFinales([]);
    }
  }, [userData]);

  const handleCancelarReserva = async (reservaId: string) => {
    const confirmar = window.confirm("¿Estás seguro de que querés cancelar esta reserva?");
    if (!confirmar) return;

    setCancelando(reservaId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/reservas/${reservaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        mostrarExito("Reserva cancelada correctamente");
        // Sacarla de la lista sin recargar la página
        setReservasFinales(prev => prev.filter(r => r._id !== reservaId));
      } else {
        const data = await res.json();
        mostrarError(data.error || "No se pudo cancelar la reserva");
      }
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      mostrarError("Error al conectar con el servidor");
    } finally {
      setCancelando(null);
    }
  };

const esFutura = (fecha: Date | string) => {
  return new Date(fecha) > new Date();
};
  if (!userData) return <p className="loading">Cargando perfil...</p>;

  return (
    <div className="perfil-wrapper">
      <div className="perfil-card">
        <div className="perfil-avatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Avatar"
          />
          <div className="perfil-nombre">
            <h1>{userData.nombre} {userData.apellido}</h1>
            <p>{userData.rol === "propietario" ? "Propietario" : "Usuario"}</p>
          </div>
        </div>

        <div className="perfil-info">
          <h2>Información personal</h2>
          <div className="info-grid">
            <div className="info-item">
              <span>Email</span>
              <p>{userData.email}</p>
            </div>
            <div className="info-item">
              <span>Rol</span>
              <p>{userData.rol}</p>
            </div>
          </div>
        </div>

        <>
          <h2 className="section-title">📅 Mis reservas</h2>
          {reservasFinales.length > 0 ? (
  <ul className="reserva-list">
    {reservasFinales.map((r) => (
      <li key={r._id} className="reserva-item">
        <div className="reserva-info">
          <strong>{r.nombreComplejo ?? "Cargando nombre..."}</strong>
          <span>{r.canchaTipo} — {new Date(r.fecha).toLocaleDateString("es-AR")} {r.horaInicio}hs</span>
        </div>
        {esFutura(r.fecha) && (
          <button
            className="btn-cancelar"
            onClick={() => handleCancelarReserva(r._id)}
            disabled={cancelando === r._id}
          >
            {cancelando === r._id ? "Cancelando..." : "Cancelar"}
          </button>
        )}
      </li>
    ))}
  </ul>
          ) : (
            <p className="no-data">Aún no realizaste reservas.</p>
          )}
        </>

      </div>
    </div>
  );
};

export default Perfil;