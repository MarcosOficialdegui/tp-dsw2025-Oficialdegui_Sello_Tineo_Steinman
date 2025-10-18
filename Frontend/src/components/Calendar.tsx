import { useState } from "react"
import "./Calendar.css"
import { mostrarExito, mostrarError } from "../utils/notificaciones";


interface TimeSlot {
  time: string
  available: boolean
}

interface CalendarProps {
  complejoId: string;
  canchaId?: string;
}

export default function Calendar({ complejoId, canchaId }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")


  // Usar complejoId para futuras funcionalidades (por ahora solo lo guardamos)
  console.log('Calendar para complejo:', complejoId);

  // Generate dates for the next 30 days
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

  const timeSlots: TimeSlot[] = [
    { time: "08:00", available: true },
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
    { time: "18:00", available: true },
    { time: "19:00", available: true },
    { time: "20:00", available: true },
    { time: "21:00", available: true },
  ]

  const dates = generateDates()


  const reservarTurno = async() => {

    console.log('Reservando turno para:', {
      complejo: complejoId,
      cancha: canchaId,
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
    // JSON DE RESERVA -----------------------------------------
    complejo: complejoId,
    cancha: canchaId,
    fecha: new Date(selectedDate),
    horaInicio: selectedTime,
  }),
})
  .then(async (response) => {
    const data = await response.json();

    if (response.ok) {
      mostrarExito(data.mensaje || "Reserva creada con éxito");
      console.log("Reserva creada:", data);
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
        </div>
      )}

      {/* Reservation Button */}
      {selectedDate && selectedTime && (
        <div className="calendar-reserve-section">
          <button
            className="calendar-reserve-btn"
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
            onClick= {reservarTurno}
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
