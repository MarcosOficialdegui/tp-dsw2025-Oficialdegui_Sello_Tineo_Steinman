import { useState, useEffect } from "react"
import "./Calendar.css"
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

  console.log('Calendar para complejo:', complejoId);

  // Cuando cambia la fecha o la cancha, consultar horarios ocupados
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

        const slots = HORARIOS_BASE.map(time => ({
          time,
          available: !ocupados.includes(time)
        }));

        setTimeSlots(slots);
      } catch (error) {
        console.error("Error al cargar horarios:", error);
        setTimeSlots(HORARIOS_BASE.map(time => ({ time, available: true })));
      } finally {
        setCargandoHorarios(false);
      }
    };

    cargarHorariosOcupados();
  }, [selectedDate, canchaId]);


  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        month: date.toLocaleDateString("es-ES", { month: "short" }),
        weekday: date.toLocaleDateString("es-ES", { weekday: "short" }),
      })
    }
    return dates
  }

  const dates = generateDates()

  const reservarTurno = async () => {
    console.log('Reservando turno para:', {
      complejo: complejoId,
      canchaTipo: canchaTipo,
      canchaId: canchaId,
      fecha: selectedDate,
      horaInicio: selectedTime,
    });

    await fetch(`http://localhost:3000/api/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        complejo: complejoId,
        canchaId: canchaId,
        canchaTipo: canchaTipo,
        fecha: new Date(selectedDate),
        horaInicio: selectedTime,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          mostrarExito(data.mensaje || "Reserva creada con éxito");
          console.log("Reserva creada:", data);
          // Marcar el horario como ocupado localmente sin refetch
          setTimeSlots(prev =>
            prev.map(slot =>
              slot.time === selectedTime ? { ...slot, available: false } : slot
            )
          );
          setSelectedTime("");
        } else {
          mostrarError(data.error || "Error al crear la reserva");
          console.error("Error en la respuesta:", data);
        }
      })
      .catch((error) => {
        console.error("Error al crear la reserva:", error);
        mostrarError("No se pudo conectar con el servidor");
      });
  }

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Selecciona tu turno</h2>

      {/* Date Selection */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 className="calendar-section-title">Fecha</h3>
        <div className="calendar-date-grid">
          {dates.map((date) => (
            <button
              key={date.date}
              onClick={() => setSelectedDate(date.date)}
              className={`calendar-date-btn${selectedDate === date.date ? " selected" : ""}`}
            >
              <div className="day">{date.day}</div>
              <div className="month">{date.month}</div>
              <div className="weekday">{date.weekday}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="calendar-section-title">Horario</h3>
          {cargandoHorarios ? (
            <p>Cargando horarios disponibles...</p>
          ) : (
            <div className="calendar-time-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`calendar-time-btn${selectedTime === slot.time ? " selected" : ""}${!slot.available ? " unavailable" : ""}`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reservation Button */}
      {selectedDate && selectedTime && (
        <div className="calendar-reserve-section">
          <button
            className="calendar-reserve-btn"
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
            onClick={reservarTurno}
          >
            Reservar Turno
          </button>
          <p className="calendar-reserve-info">
            Fecha: {new Date(selectedDate).toLocaleDateString("es-ES")} - Hora: {selectedTime}
          </p>
        </div>
      )}
    </div>
  )
}