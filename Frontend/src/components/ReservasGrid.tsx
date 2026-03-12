import { useState, useEffect } from 'react';
import styles from './ReservasGrid.module.css';

interface Reserva {
  _id: string;
  fecha: string;
  horaInicio: string;
  canchaTipo: string;
  canchaId: string;
  user: {
    _id: string;
    nombre: string;
    apellido: string;
    telefono?: string;
  };
}

interface Cancha {
  _id: string;
  nombre?: string;
  tipoCancha: string;
  precioHora: number;
  disponible: boolean;
}

interface Props {
  complejoId: string;
}

const HORARIOS = [
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00",
  "15:00","16:00","17:00","18:00","19:00","20:00","21:00"
];

export default function ReservasGrid({ complejoId }: Props) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [cargando, setCargando] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Cargar canchas del complejo
  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/complejos/${complejoId}`);
        if (res.ok) {
          const data = await res.json();
          setCanchas(data.canchas || []);
        }
      } catch (e) {
        console.error('Error al cargar canchas:', e);
      }
    };
    cargarCanchas();
  }, [complejoId]);

  // Cargar reservas del día
  useEffect(() => {
    cargarReservas();
  }, [complejoId, fechaSeleccionada]);

  const cargarReservas = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/complejos/${complejoId}/reservas?fecha=${fechaSeleccionada}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Error al cargar reservas');
      const data = await res.json();
      setReservas(data);
    } catch (e) {
      console.error(e);
      setReservas([]);
    } finally {
      setCargando(false);
    }
  };

  const obtenerProximosDias = () => {
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);
      dias.push(fecha);
    }
    return dias;
  };

  // Buscar reserva para una cancha + horario específico
  const getReserva = (canchaId: string, hora: string): Reserva | undefined => {
    return reservas.find(r => r.canchaId === canchaId && r.horaInicio === hora);
  };

  const totalReservas = reservas.length;
  const totalGanancias = reservas.reduce((acc, r) => {
    const cancha = canchas.find(c => c._id === r.canchaId);
    return acc + (cancha?.precioHora || 0);
  }, 0);

  const dias = obtenerProximosDias();

  return (
    <div className={styles.wrapper}>

      {/* Selector de días */}
      <div className={styles.diasRow}>
        {dias.map((fecha, i) => {
          const dateStr = fecha.toISOString().split('T')[0];
          const esHoy = i === 0;
          const seleccionada = dateStr === fechaSeleccionada;
          return (
            <button
              key={dateStr}
              className={`${styles.diaBtn} ${seleccionada ? styles.diaBtnSelected : ''}`}
              onClick={() => setFechaSeleccionada(dateStr)}
            >
              {esHoy && <span className={styles.hoyDot} />}
              <span className={styles.diaSemana}>
                {fecha.toLocaleDateString('es-AR', { weekday: 'short' })}
              </span>
              <span className={styles.diaNro}>{fecha.getDate()}</span>
              <span className={styles.diaMes}>
                {fecha.toLocaleDateString('es-AR', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resumen del día */}
      <div className={styles.resumenRow}>
        <div className={styles.resumenItem}>
          <span className={styles.resumenLabel}>Reservas del día</span>
          <span className={styles.resumenVal}>{totalReservas}</span>
        </div>
        <div className={styles.resumenDivider} />
        <div className={styles.resumenItem}>
          <span className={styles.resumenLabel}>Ingresos estimados</span>
          <span className={styles.resumenVal}>
            ${totalGanancias.toLocaleString('es-AR')}
          </span>
        </div>
        <div className={styles.resumenDivider} />
        <div className={styles.resumenItem}>
          <span className={styles.resumenLabel}>Canchas</span>
          <span className={styles.resumenVal}>{canchas.length}</span>
        </div>
      </div>

      {/* Tabla */}
      {cargando ? (
        <div className={styles.loading}>
          <div className={styles.loadingDots}><span /><span /><span /></div>
          <p>Cargando reservas...</p>
        </div>
      ) : canchas.length === 0 ? (
        <div className={styles.empty}>
          <p>Este complejo no tiene canchas registradas.</p>
        </div>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCancha}>Cancha</th>
                {HORARIOS.map(h => (
                  <th key={h} className={styles.thHora}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {canchas.map((cancha, idx) => (
                <tr key={cancha._id || idx}>
                  {/* Celda de cancha */}
                  <td className={styles.tdCancha}>
                    <span className={styles.canchaTag}>{cancha.tipoCancha}</span>
                    {cancha.nombre && (
                      <span className={styles.canchaNombre}>{cancha.nombre}</span>
                    )}
                    <span className={styles.canchaPrecio}>
                      ${cancha.precioHora.toLocaleString('es-AR')}/h
                    </span>
                  </td>

                  {/* Celdas de horarios */}
                  {HORARIOS.map(hora => {
                    const reserva = getReserva(cancha._id || '', hora);
                    return (
                      <td
                        key={hora}
                        className={`${styles.tdSlot} ${reserva ? styles.tdSlotOcupado : styles.tdSlotLibre}`}
                        title={reserva ? `${reserva.user.nombre} ${reserva.user.apellido}` : 'Disponible'}
                      >
                        {reserva ? (
                          <div className={styles.reservaCell}>
                            <span className={styles.reservaUser}>
                              {reserva.user.nombre} {reserva.user.apellido[0]}.
                            </span>
                          </div>
                        ) : (
                          <span className={styles.libreIndicator} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leyenda */}
      <div className={styles.leyenda}>
        <div className={styles.leyendaItem}>
          <span className={styles.leyendaOcupado} />
          <span>Reservado</span>
        </div>
        <div className={styles.leyendaItem}>
          <span className={styles.leyendaLibre} />
          <span>Disponible</span>
        </div>
      </div>
    </div>
  );
}