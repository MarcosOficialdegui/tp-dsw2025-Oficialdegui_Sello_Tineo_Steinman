import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import styles from "./Dashboard.module.css";
import ComplejoForm from "../components/ComplejoForm";
import ReservasCalendario from "../components/ReservasCalendar";
import { mostrarExito, mostrarError } from "../utils/notificaciones";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface Complejo {
  _id: string;
  nombre: string;
  direccion: string;
  ciudad: { nombre: string };
  canchas: any[];
}

interface Estadisticas {
  complejo: { nombre: string; totalCanchas: number };
  resumen: {
    totalReservas: number;
    gananciaTotal: number;
    reservasMesActual: number;
    gananciasMesActual: number;
  };
  graficos: {
    reservasPorDia: { fecha: string; reservas: number; ganancias: number }[];
    canchasMasReservadas: { tipo: string; cantidad: number }[];
    horasPico: { hora: string; cantidad: number }[];
  };
  proximasReservas: {
    _id: string;
    canchaTipo: string;
    fecha: string;
    horaInicio: string;
    usuario: string;
  }[];
}

type Vista = "stats" | "reservas" | "agregar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [complejoSeleccionado, setComplejoSeleccionado] = useState<string | null>(null);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [cargandoComplejos, setCargandoComplejos] = useState(true);
  const [cargandoStats, setCargandoStats] = useState(false);
  const [vista, setVista] = useState<Vista>("stats");

  useEffect(() => {
    cargarComplejos();
  }, []);

  const cargarComplejos = async () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    try {
      const res = await fetch("http://localhost:3000/api/estadisticas/mis-complejos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setComplejos(data.complejos || []);
      if (data.complejos?.length > 0) {
        setComplejoSeleccionado(data.complejos[0]._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCargandoComplejos(false);
    }
  };

  useEffect(() => {
    if (!complejoSeleccionado || vista !== "stats") return;
    const cargarStats = async () => {
      setCargandoStats(true);
      setStats(null);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:3000/api/estadisticas/complejo/${complejoSeleccionado}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        setStats(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setCargandoStats(false);
      }
    };
    cargarStats();
  }, [complejoSeleccionado, vista]);

  const handleEliminar = (complejoId: string) => {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que querés eliminar este complejo? Esta acción no se puede deshacer.",
      buttons: [
        {
          label: "Sí, eliminar",
          onClick: async () => {
            const token = localStorage.getItem("token");
            try {
              const res = await fetch(`http://localhost:3000/api/complejos/${complejoId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
              });
              if (res.ok) {
                mostrarExito("Complejo eliminado correctamente");
                const nuevos = complejos.filter(c => c._id !== complejoId);
                setComplejos(nuevos);
                setComplejoSeleccionado(nuevos[0]?._id || null);
                setStats(null);
              } else {
                mostrarError("No se pudo eliminar el complejo");
              }
            } catch {
              mostrarError("Error al conectar con el servidor");
            }
          }
        },
        { label: "Cancelar", onClick: () => {} }
      ]
    });
  };

  const formatPeso = (n: number) =>
    "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 0 });

  const complejoActual = complejos.find(c => c._id === complejoSeleccionado);

  if (cargandoComplejos) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingDots}><span /><span /><span /></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>⚽</span>
          <span className={styles.sidebarTitle}>Panel</span>
        </div>

        {/* Acciones globales */}
        <div className={styles.sidebarSection}>
          <p className={styles.sidebarSectionLabel}>Acciones</p>
          <button
            className={`${styles.sidebarAction} ${vista === "agregar" ? styles.sidebarActionActive : ""}`}
            onClick={() => { setVista("agregar"); setComplejoSeleccionado(null); }}
          >
            <span>➕</span> Registrar complejo
          </button>
        </div>

        {/* Complejos */}
        {complejos.length > 0 && (
          <div className={styles.sidebarSection}>
            <p className={styles.sidebarSectionLabel}>Mis complejos</p>
            <nav className={styles.sidebarNav}>
              {complejos.map(c => (
                <button
                  key={c._id}
                  className={`${styles.sidebarItem} ${complejoSeleccionado === c._id && vista !== "agregar" ? styles.sidebarItemActive : ""}`}
                  onClick={() => { setComplejoSeleccionado(c._id); setVista("stats"); }}
                >
                  <span className={styles.sidebarItemIcon}>🏟️</span>
                  <div className={styles.sidebarItemInfo}>
                    <span className={styles.sidebarItemNombre}>{c.nombre}</span>
                    <span className={styles.sidebarItemDireccion}>{c.ciudad?.nombre}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className={styles.sidebarFooter}>
          <button className={styles.btnVer} onClick={() => navigate(`/complejo/${complejoSeleccionado}`)}>
            Ver página pública
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* ── VISTA: AGREGAR COMPLEJO ── */}
        {vista === "agregar" && (
          <div className={styles.formWrapper}>
            <div className={styles.mainHeader}>
              <div>
                <h1 className={styles.mainTitle}>Registrar nuevo complejo</h1>
                <p className={styles.mainSub}>Completá los datos para agregar tu complejo</p>
              </div>
            </div>
            <ComplejoForm />
          </div>
        )}

        {/* ── VISTA: COMPLEJO SELECCIONADO ── */}
        {vista !== "agregar" && complejoSeleccionado && (
          <>
            {/* Header del complejo */}
            <div className={styles.mainHeader}>
              <div>
                <h1 className={styles.mainTitle}>{complejoActual?.nombre}</h1>
                <p className={styles.mainSub}>
                  {complejoActual?.ciudad?.nombre} · {complejoActual?.canchas?.length} cancha{complejoActual?.canchas?.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                className={styles.btnEliminar}
                onClick={() => handleEliminar(complejoSeleccionado)}
              >
                🗑️ Eliminar complejo
              </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${vista === "stats" ? styles.tabActive : ""}`}
                onClick={() => setVista("stats")}
              >
                📊 Estadísticas
              </button>
              <button
                className={`${styles.tab} ${vista === "reservas" ? styles.tabActive : ""}`}
                onClick={() => setVista("reservas")}
              >
                📅 Reservas del día
              </button>
            </div>

            {/* ── TAB: ESTADÍSTICAS ── */}
            {vista === "stats" && (
              <>
                {cargandoStats || !stats ? (
                  <div className={styles.loadingMain}>
                    <div className={styles.loadingDots}><span /><span /><span /></div>
                  </div>
                ) : (
                  <>
                    {/* KPIs */}
                    <div className={styles.kpiGrid}>
                      <div className={styles.kpiCard}>
                        <span className={styles.kpiIcon}>📅</span>
                        <div>
                          <p className={styles.kpiLabel}>Reservas este mes</p>
                          <p className={styles.kpiValue}>{stats.resumen.reservasMesActual}</p>
                        </div>
                      </div>
                      <div className={styles.kpiCard}>
                        <span className={styles.kpiIcon}>💰</span>
                        <div>
                          <p className={styles.kpiLabel}>Ganancias este mes</p>
                          <p className={styles.kpiValue}>{formatPeso(stats.resumen.gananciasMesActual)}</p>
                        </div>
                      </div>
                      <div className={styles.kpiCard}>
                        <span className={styles.kpiIcon}>📊</span>
                        <div>
                          <p className={styles.kpiLabel}>Reservas totales</p>
                          <p className={styles.kpiValue}>{stats.resumen.totalReservas}</p>
                        </div>
                      </div>
                      <div className={styles.kpiCard}>
                        <span className={styles.kpiIcon}>🏆</span>
                        <div>
                          <p className={styles.kpiLabel}>Ganancias totales</p>
                          <p className={styles.kpiValue}>{formatPeso(stats.resumen.gananciaTotal)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Gráficos */}
                    <div className={styles.chartsGrid}>
                      <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Reservas — últimos 7 días</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={stats.graficos.reservasPorDia} barSize={24}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#999" }} />
                            <YAxis tick={{ fontSize: 11, fill: "#999" }} allowDecimals={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2efe3", fontSize: 12 }} formatter={(v: any) => [v, "Reservas"]} />
                            <Bar dataKey="reservas" fill="#6fcf7f" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Ganancias — últimos 7 días</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={stats.graficos.reservasPorDia}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#999" }} />
                            <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2efe3", fontSize: 12 }} formatter={(v: any) => [formatPeso(v), "Ganancias"]} />
                            <Line type="monotone" dataKey="ganancias" stroke="#4caf50" strokeWidth={2} dot={{ fill: "#4caf50", r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Canchas más reservadas</h3>
                        {stats.graficos.canchasMasReservadas.length === 0 ? (
                          <p className={styles.noData}>Sin datos todavía</p>
                        ) : (
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.graficos.canchasMasReservadas} layout="vertical" barSize={20}>
                              <XAxis type="number" tick={{ fontSize: 11, fill: "#999" }} allowDecimals={false} />
                              <YAxis dataKey="tipo" type="category" tick={{ fontSize: 11, fill: "#555" }} width={80} />
                              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2efe3", fontSize: 12 }} formatter={(v: any) => [v, "Reservas"]} />
                              <Bar dataKey="cantidad" fill="#a5d6a7" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>

                      <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Horas pico</h3>
                        {stats.graficos.horasPico.length === 0 ? (
                          <p className={styles.noData}>Sin datos todavía</p>
                        ) : (
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.graficos.horasPico} barSize={24}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="hora" tick={{ fontSize: 11, fill: "#999" }} />
                              <YAxis tick={{ fontSize: 11, fill: "#999" }} allowDecimals={false} />
                              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2efe3", fontSize: 12 }} formatter={(v: any) => [v, "Reservas"]} />
                              <Bar dataKey="cantidad" fill="#81c784" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Próximas reservas */}
                    <div className={styles.tableCard}>
                      <h3 className={styles.chartTitle}>Próximas reservas</h3>
                      {stats.proximasReservas.length === 0 ? (
                        <p className={styles.noData}>No hay reservas próximas.</p>
                      ) : (
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>Cliente</th>
                              <th>Cancha</th>
                              <th>Fecha</th>
                              <th>Hora</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.proximasReservas.map(r => (
                              <tr key={r._id}>
                                <td>{r.usuario}</td>
                                <td><span className={styles.canchaTag}>{r.canchaTipo}</span></td>
                                <td>{new Date(r.fecha).toLocaleDateString("es-AR")}</td>
                                <td>{r.horaInicio}hs</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── TAB: RESERVAS DEL DÍA ── */}
            {vista === "reservas" && (
              <div className={styles.reservasWrapper}>
                <ReservasCalendario complejoId={complejoSeleccionado} />
              </div>
            )}
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {vista !== "agregar" && !complejoSeleccionado && (
          <div className={styles.emptyScreen}>
            <div className={styles.emptyIcon}>🏟️</div>
            <h2>No tenés complejos registrados</h2>
            <p>Registrá tu primer complejo para ver las estadísticas.</p>
            <button className={styles.btnPrimary} onClick={() => setVista("agregar")}>
              Registrar complejo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}