import "./Perfil.css";
import { useState, useEffect } from "react";

interface Reserva {
  _id: string;
  fecha: string;
  cancha: string;
  usuario?: string;
  complejo?: string;
}

interface Complejo {
  _id: string;
  nombre: string;
  direccion: string;
  reservas?: Reserva[];
}

interface User {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  complejos?: Complejo[];
  reservas?: Reserva[];
}

const Perfil = () => {
  const [userData, setUserData] = useState<User | null>(null);

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
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    llamarDatos();
  }, []);

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

        {/* Sección dinámica */}
        {userData.rol === "propietario" ? (
          <>
            <h2 className="section-title">🏟️ Mis complejos</h2>
            {userData.complejos && userData.complejos.length > 0 ? (
              userData.complejos.map((complejo) => (
                <div key={complejo._id} className="complejo-card">
                  <h3>{complejo.nombre}</h3>
                  <p className="direccion">{complejo.direccion}</p>

                  <h4>Reservas en este complejo:</h4>
                  {complejo.reservas && complejo.reservas.length > 0 ? (
                    <ul className="reserva-list">
                      {complejo.reservas.map((r) => (
                        <li key={r._id}>
                          <strong>{r.usuario}</strong> — {r.cancha} —{" "}
                          {new Date(r.fecha).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">Sin reservas registradas</p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-data">No tenés complejos publicados aún.</p>
            )}
          </>
        ) : (
          <>
            <h2 className="section-title">📅 Mis reservas</h2>
            {userData.reservas && userData.reservas.length > 0 ? (
              <ul className="reserva-list">
                {userData.reservas.map((r) => (
                  <li key={r._id}>
                    <strong>{r.complejo}</strong> — {r.cancha} —{" "}
                    {new Date(r.fecha).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">Aún no realizaste reservas.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Perfil;
