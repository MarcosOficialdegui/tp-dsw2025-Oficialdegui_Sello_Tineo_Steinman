import { useState, useEffect, useRef } from "react"
import styles from "./Calendar.module.css"
import { mostrarExito, mostrarError } from "../utils/notificaciones";


interface TimeSlot {
  time: string
  available: boolean
}

interface CalendarProps {
  complejoId: string;
  canchaTipo?: string;
  canchaId?: string;
}

const HORARIOS_BASE = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

export default function Calendar({ complejoId, canchaId, canchaTipo }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [cargandoHorarios, setCargandoHorarios] = useState(false)
  const horariosRef = useRef<HTMLDivElement>(null)

  console.log('Calendar para complejo:', complejoId);

  useEffect(() => {
    if (!selectedDate || !canchaId) return;

    const cargarHorariosOcupados = async () => {
      setCargandoHorarios(true);
      setSelectedTime("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/reservas/horarios-ocupados?canchaId=${canchaId}&fecha=${selectedDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Error al cargar horarios");

        const data = await response.json();
        const ocupados: string[] = data.horariosOcupados;

        setTimeSlots(HORARIOS_BASE.map(time => ({
          time,
          available: !ocupados.includes(time)
        })));
      } catch (error) {
        console.error("Error al cargar horarios:", error);
        setTimeSlots(HORARIOS_BASE.map(time => ({ time, available: true })));
      } finally {
        setCargandoHorarios(false);
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            horariosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    };

    cargarHorariosOcupados();
  }, [selectedDate, canchaId]);

  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        month: date.toLocaleDateString("es-ES", { month: "short" }),
        weekday: date.toLocaleDateString("es-ES", { weekday: "short" }),
        isToday: i === 0,
      })
    }
    return dates
  }

  const dates = generateDates()

  const reservarTurno = async () => {
    console.log('Reservando turno para:', { complejo: complejoId, canchaTipo, canchaId, fecha: selectedDate, horaInicio: selectedTime });

    await fetch(`http://localhost:3000/api/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        complejo: complejoId,
        canchaId,
        canchaTipo,
        fecha: new Date(selectedDate),
        horaInicio: selectedTime,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          mostrarExito(data.mensaje || "Reserva creada con éxito");
          setTimeSlots(prev =>
            prev.map(slot =>
              slot.time === selectedTime ? { ...slot, available: false } : slot
            )
          );
          setSelectedTime("");
        } else {
          mostrarError(data.error || "Error al crear la reserva");
        }
      })
      .catch((error) => {
        console.error("Error al crear la reserva:", error);
        mostrarError("No se pudo conectar con el servidor");
      });
  }

  const selectedDateObj = dates.find(d => d.date === selectedDate);

  return (
    <div className={styles.wrapper}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerDot} />
          <h2 className={styles.headerTitle}>Seleccioná tu turno</h2>
        </div>
        {canchaTipo && (
          <span className={styles.canchaBadge}>{canchaTipo}</span>
        )}
      </div>

      {/* Fecha */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Fecha</p>
        <div className={styles.datesScroll}>
          {dates.map((date) => (
            <button
              key={date.date}
              onClick={() => setSelectedDate(date.date)}
              className={`${styles.dateBtn} ${selectedDate === date.date ? styles.dateBtnSelected : ""}`}
            >
              {date.isToday && <span className={styles.todayDot} />}
              <span className={styles.dateWeekday}>{date.weekday}</span>
              <span className={styles.dateDay}>{date.day}</span>
              <span className={styles.dateMonth}>{date.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Horarios */}
      {selectedDate && (
        <div ref={horariosRef} className={styles.section}>
          <div className={styles.sectionLabelRow}>
            <p className={styles.sectionLabel}>Horarios disponibles</p>
            {selectedDateObj && (
              <span className={styles.fechaChip}>
                {selectedDateObj.weekday} {selectedDateObj.day} {selectedDateObj.month}
              </span>
            )}
          </div>

          {cargandoHorarios ? (
            <div className={styles.loadingRow}>
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} style={{ animationDelay: "0.15s" }} />
              <span className={styles.loadingDot} style={{ animationDelay: "0.3s" }} />
              <span className={styles.loadingText}>Cargando horarios...</span>
            </div>
          ) : (
            <div className={styles.timesGrid}>
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`${styles.timeBtn} ${
                    selectedTime === slot.time ? styles.timeBtnSelected : ""
                  } ${!slot.available ? styles.timeBtnUnavailable : ""}`}
                >
                  <span className={styles.timeText}>{slot.time}</span>
                  {!slot.available && <span className={styles.unavailableLine} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resumen + Botón */}
      {selectedDate && selectedTime && (
        <div className={styles.reservaFooter}>
          <div className={styles.reservaSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Fecha</span>
              <span className={styles.summaryValue}>
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", {
                  weekday: "short", day: "numeric", month: "long"
                })}
              </span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Hora</span>
              <span className={styles.summaryValue}>{selectedTime}</span>
            </div>
            {canchaTipo && (
              <>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Cancha</span>
                  <span className={styles.summaryValue}>{canchaTipo}</span>
                </div>
              </>
            )}
          </div>

          <button className={styles.reservarBtn} onClick={reservarTurno}>
            Confirmar reserva
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}