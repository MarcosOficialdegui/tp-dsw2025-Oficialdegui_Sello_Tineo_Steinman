import "./Perfil.css";
import { useState, useEffect } from "react";

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


        // Obtener reservas del usuario
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
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Nombre del complejo:", data.nombre);
        return data.nombre || "Nombre no disponible";
      }
    } catch (error) {
      console.error("Error al obtener el nombre del complejo:", error);
    }
  }

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
      // Si el usuario no tiene reservas
      setReservasFinales([]);

    }


  }, [reservasUser, userData]);


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

        <>
          <h2 className="section-title">📅 Mis reservas</h2>
          {reservasFinales.length > 0 ? (
            <ul className="reserva-list">
              {reservasFinales.map((r) => (
                <li key={r._id}>
                  <strong>
                    {
                      r.nombreComplejo ? r.nombreComplejo : "Cargando nombre..."
                    }
                  </strong> — {r.canchaTipo} —{" "}
                  {new Date(r.fecha).toLocaleString()}
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
