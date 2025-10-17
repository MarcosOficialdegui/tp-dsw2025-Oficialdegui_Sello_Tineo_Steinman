import { useState, useEffect } from 'react';
import styles from './ReservasCalendar.module.css';
import { MdCalendarToday, MdAccessTime, MdPerson, MdPhone, MdSportsSoccer } from 'react-icons/md';

interface Reserva {
  _id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cancha: {
    _id: string;
    nombre: string;
    tipoCancha: string;
  };
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    telefono?: string;
  };
  estado: string;
}

interface Props {
  complejoId: string;
}

export default function ReservasCalendario({ complejoId }: Props) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    cargarReservas();
  }, [complejoId, fechaSeleccionada]);

  const cargarReservas = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/complejos/${complejoId}/reservas?fecha=${fechaSeleccionada}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar reservas');
      }

      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
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

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const esFechaSeleccionada = (fecha: Date) => {
    return fecha.toISOString().split('T')[0] === fechaSeleccionada;
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return styles.confirmada;
      case 'pendiente':
        return styles.pendiente;
      case 'cancelada':
        return styles.cancelada;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      {/* Selector de días */}
      <div className={styles.selectorDias}>
        {obtenerProximosDias().map((fecha, index) => (
          <button
            key={index}
            className={`${styles.diaBtn} ${esFechaSeleccionada(fecha) ? styles.diaSeleccionado : ''}`}
            onClick={() => setFechaSeleccionada(fecha.toISOString().split('T')[0])}
          >
            <span className={styles.diaNombre}>{formatearFecha(fecha)}</span>
          </button>
        ))}
      </div>

      {/* Lista de reservas */}
      <div className={styles.reservasContainer}>
        {cargando ? (
          <div className={styles.cargando}>
            <p>Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className={styles.sinReservas}>
            <MdCalendarToday size={48} />
            <p>No hay reservas para esta fecha</p>
          </div>
        ) : (
          reservas.map((reserva) => (
            <div
              key={reserva._id}
              className={`${styles.reservaCard} ${obtenerColorEstado(reserva.estado)}`}
            >
              <div className={styles.reservaHeader}>
                <div className={styles.horario}>
                  <MdAccessTime size={20} />
                  <span>{reserva.horaInicio} - {reserva.horaFin}</span>
                </div>
                <span className={styles.estadoBadge}>{reserva.estado}</span>
              </div>

              <div className={styles.reservaBody}>
                <div className={styles.canchaInfo}>
                  <MdSportsSoccer size={18} />
                  <span>{reserva.cancha.nombre} ({reserva.cancha.tipoCancha})</span>
                </div>

                <div className={styles.usuarioInfo}>
                  <div className={styles.infoItem}>
                    <MdPerson size={18} />
                    <span>{reserva.usuario.nombre} {reserva.usuario.apellido}</span>
                  </div>
                  {reserva.usuario.telefono && (
                    <div className={styles.infoItem}>
                      <MdPhone size={18} />
                      <span>{reserva.usuario.telefono}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}