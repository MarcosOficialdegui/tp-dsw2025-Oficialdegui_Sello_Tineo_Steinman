import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  MdAccessTime,
  MdCelebration,
  MdCheckCircle,
  MdCottage,
  MdEmojiEvents,
  MdFastfood,
  MdLocalParking,
  MdLocationOn,
  MdOutdoorGrill,
  MdRestaurant,
  MdSecurity,
  MdShower,
  MdSportsSoccer,
  MdVerified,
  MdWifi,
} from "react-icons/md";
import type { IconType } from "react-icons";
import DeportePicker from "../components/DeportePicker";
import SlotPicker from "../components/SlotPicker.tsx";
import CanchasDisponibles from "../components/CanchasDisponibles.tsx";
import ConfirmDrawer from "../components/ConfirmDrawer";
import { useComplejo } from "../hooks/useComplejo";
import { useDisponibilidad } from "../hooks/useDisponibilidad";
import type { Cancha } from "../api/complejos";
import { mostrarExito, mostrarError } from "../utils/notificaciones";
import "./PerfilComplejo.css";

interface Slot {
  fecha: string;
  hora: string;
}

interface HeroServiceItem {
  icono: IconType;
  label: string;
}

const SERVICIO_META: Array<{ matcher: RegExp; label: string; icono: IconType }> = [
  { matcher: /vestuario/, label: "Vestuario", icono: MdShower },
  { matcher: /(estacionamiento|parking)/, label: "Estacionamiento", icono: MdLocalParking },
  { matcher: /(wi\s*-?\s*fi|wifi|internet)/, label: "Wi-Fi", icono: MdWifi },
  { matcher: /(bar|restaurante|restaurant|cantina)/, label: "Bar/Restaurante", icono: MdRestaurant },
  { matcher: /parrilla/, label: "Parrilla", icono: MdOutdoorGrill },
  { matcher: /seguridad/, label: "Seguridad", icono: MdSecurity },
  { matcher: /torneo/, label: "Torneos", icono: MdEmojiEvents },
  { matcher: /quincho/, label: "Quincho", icono: MdCottage },
  { matcher: /buffet/, label: "Buffet", icono: MdFastfood },
  { matcher: /(cumple|cumpleaños|cumpleanos)/, label: "Cumpleaños", icono: MdCelebration },
];

function normalizarTexto(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function formatearTipoCancha(tipo: string): string {
  const clean = tipo.trim();
  if (/^futbol\s*5$/i.test(clean)) return "Fútbol 5";
  if (/^futbol\s*7$/i.test(clean)) return "Fútbol 7";
  if (/^padel$/i.test(clean)) return "Pádel";
  return clean;
}

function normalizarTipoCancha(tipo: string): string {
  const clean = tipo.trim();
  if (/^futbol\s*5$/i.test(clean)) return "Futbol 5";
  if (/^futbol\s*7$/i.test(clean)) return "Futbol 7";
  if (/^padel$/i.test(clean)) return "Padel";
  return clean;
}

function mapearServicios(servicios: string[]): HeroServiceItem[] {
  const vistos = new Set<string>();
  const result: HeroServiceItem[] = [];

  servicios.forEach((raw) => {
    const normalizado = normalizarTexto(raw);
    const matched = SERVICIO_META.find((item) => item.matcher.test(normalizado));

    if (matched && !vistos.has(matched.label)) {
      vistos.add(matched.label);
      result.push({ icono: matched.icono, label: matched.label });
      return;
    }

    const label = raw.trim();
    if (label && !vistos.has(label)) {
      vistos.add(label);
      result.push({ icono: MdCheckCircle, label });
    }
  });

  return result;
}

export default function PerfilComplejo() {
  const { id } = useParams<{ id: string }>();

  const { complejo, cargando: cargandoComplejo, error: errorComplejo } = useComplejo(id);

  const [slot, setSlot] = useState<Slot | null>(null);
  const [fechaPersistida, setFechaPersistida] = useState<string | undefined>(undefined);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState<string | null>(null);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<Cancha | null>(null);

  const {
    canchasDisponibles,
    cargando: cargandoDisp,
    error: errorDisponibilidad,
  } = useDisponibilidad(id, slot?.fecha ?? null, slot?.hora ?? null);

  useEffect(() => {
    if (errorDisponibilidad) {
      mostrarError(errorDisponibilidad);
    }
  }, [errorDisponibilidad]);

  const tiposCanchaLabel = useMemo(() => {
    if (!complejo) return "Canchas deportivas";

    const vistos = new Set<string>();
    const etiquetas: string[] = [];

    complejo.canchas.forEach((cancha) => {
      const etiqueta = formatearTipoCancha(cancha.tipoCancha);
      if (!vistos.has(etiqueta)) {
        vistos.add(etiqueta);
        etiquetas.push(etiqueta);
      }
    });

    return etiquetas.length > 0 ? etiquetas.join(" · ") : "Canchas deportivas";
  }, [complejo]);

  const serviciosHero = useMemo(() => {
    if (!complejo) return [];
    return mapearServicios(complejo.servicios);
  }, [complejo]);

  const handleSlotSelected = useCallback((nuevoSlot: Slot) => {
    setSlot(nuevoSlot);
    setFechaPersistida(nuevoSlot.fecha);
    setCanchaSeleccionada(null);
  }, []);

  const handleCambiarSlot = useCallback(() => {
    setSlot(null);
    setCanchaSeleccionada(null);
  }, []);

  const handleCambiarDeporte = useCallback(() => {
    setDeporteSeleccionado(null);
    setSlot(null);
    setCanchaSeleccionada(null);
  }, []);

  const handleReservaExitosa = useCallback(() => {
    mostrarExito("¡Reserva confirmada! Te esperamos.");
    setDeporteSeleccionado(null);
    setSlot(null);
    setCanchaSeleccionada(null);
  }, []);

  const pasoActual = !deporteSeleccionado ? 1 : !slot ? 2 : !canchaSeleccionada ? 3 : 4;

  const canchasFiltradas = useMemo(() => {
    if (!deporteSeleccionado) return [];
    return (
      complejo?.canchas.filter(
        (cancha) => normalizarTipoCancha(cancha.tipoCancha) === deporteSeleccionado
      ) ?? []
    );
  }, [complejo, deporteSeleccionado]);

  const handleVolverPaso = useCallback(
    (paso: number) => {
      if (paso === 1 && pasoActual >= 2) {
        handleCambiarDeporte();
      }

      if (paso === 2 && pasoActual >= 3) {
        handleCambiarSlot();
      }

      if (paso === 3 && pasoActual === 4) {
        setCanchaSeleccionada(null);
      }
    },
    [handleCambiarDeporte, handleCambiarSlot, pasoActual]
  );

  if (cargandoComplejo) {
    return (
      <div className="complejo-container">
        <div className="complejo-loading" role="status" aria-label="Cargando complejo">
          <div className="complejo-loading-dots">
            <span />
            <span />
            <span />
          </div>
          <p>Cargando complejo...</p>
        </div>
      </div>
    );
  }

  if (errorComplejo || !complejo) {
    return (
      <div className="complejo-container">
        <div className="complejo-error" role="alert">
          <p>{errorComplejo ?? "Complejo no encontrado"}</p>
        </div>
      </div>
    );
  }

  const mostrarServicios = serviciosHero.length > 0;

  return (
    <div className="complejo-container">
      <header className="complejo-hero">
        <div className="complejo-hero-inner">
          <div className={`complejo-hero-grid ${!mostrarServicios ? "complejo-hero-grid-full" : ""}`}>
            <div className="complejo-hero-main">
              <div className="complejo-sport-tag">
                <MdSportsSoccer size={13} aria-hidden="true" />
                <span>{deporteSeleccionado ? formatearTipoCancha(deporteSeleccionado) : tiposCanchaLabel}</span>
              </div>

              <h1 className="complejo-title">{complejo.nombre}</h1>

              <p className="complejo-direccion">
                <MdLocationOn size={16} aria-hidden="true" />
                <span>
                  {complejo.direccion}, {complejo.ciudad.nombre}
                </span>
              </p>

              <div className="complejo-horario-chip">
                <MdAccessTime size={14} aria-hidden="true" />
                <span>
                  Abierto {complejo.horarioApertura} - {complejo.horarioCierre}
                </span>
              </div>

              <ul className="complejo-stats" aria-label="Información del complejo">
                <li>
                  <MdSportsSoccer size={14} aria-hidden="true" />
                  <span>{complejo.canchas.length} canchas</span>
                </li>
                {complejo.servicios.length > 0 && (
                  <li>
                    <MdEmojiEvents size={14} aria-hidden="true" />
                    <span>{complejo.servicios.length} servicios</span>
                  </li>
                )}
                <li>
                  <MdVerified size={14} aria-hidden="true" />
                  <span>Verificado</span>
                </li>
              </ul>
            </div>

            {mostrarServicios && (
              <aside className="complejo-hero-services" aria-label="Servicios incluidos">
                <h2>Servicios incluidos</h2>
                <div className="complejo-servicios-grid">
                  {serviciosHero.map((servicio) => {
                    const Icono = servicio.icono;
                    return (
                      <span key={servicio.label} className="servicio-chip">
                        <Icono size={14} aria-hidden="true" />
                        <span>{servicio.label}</span>
                      </span>
                    );
                  })}
                </div>
              </aside>
            )}
          </div>
        </div>
      </header>

      <main className="complejo-main">
        <div className="steps-indicator" aria-label="Progreso de la reserva">
          {["Elegí deporte", "Elegí horario", "Elegí cancha", "Confirmá"].map((label, index) => {
            const paso = index + 1;
            const activo = paso === pasoActual;
            const completado = paso < pasoActual;
            const clickeable =
              (paso === 1 && pasoActual >= 2) ||
              (paso === 2 && pasoActual >= 3) ||
              (paso === 3 && pasoActual === 4);
            const ariaLabel = completado
              ? `Volver a: ${label}`
              : activo
              ? `${label} (paso actual)`
              : `${label} (pendiente)`;

            return (
              <div
                key={paso}
                className={`step-item ${activo ? "step-active" : ""} ${
                  completado ? "step-done" : ""
                }`}
              >
                <button
                  type="button"
                  className={`step-button ${clickeable ? "step-button-clickable" : ""}`}
                  aria-current={activo ? "step" : undefined}
                  aria-label={ariaLabel}
                  disabled={!clickeable}
                  onClick={() => handleVolverPaso(paso)}
                >
                  <span className="step-circle" aria-hidden="true">
                    {completado ? <MdCheckCircle size={14} /> : paso}
                  </span>
                  <span className="step-label">{label}</span>
                </button>
                {index < 3 && <div className="step-connector" aria-hidden="true" />}
              </div>
            );
          })}
        </div>

        <div className="complejo-content">
          {!deporteSeleccionado && (
            <DeportePicker
              canchas={complejo.canchas}
              onDeporteSeleccionado={setDeporteSeleccionado}
            />
          )}

          {deporteSeleccionado && !slot && (
            <SlotPicker
              horarioApertura={complejo.horarioApertura ?? "08:00"}
              horarioCierre={complejo.horarioCierre ?? "22:00"}
              fechaInicial={fechaPersistida}
              deporteLabel={deporteSeleccionado}
              onSlotSelected={handleSlotSelected}
            />
          )}

          {deporteSeleccionado && slot && (
            <CanchasDisponibles
              canchas={canchasFiltradas}
              canchasDisponibles={canchasDisponibles}
              cargando={cargandoDisp}
              slot={slot}
              horarioApertura={complejo.horarioApertura ?? "08:00"}
              horarioCierre={complejo.horarioCierre ?? "22:00"}
              onSeleccionarCancha={setCanchaSeleccionada}
              onCambiarSlot={handleCambiarSlot}
              onSlotSugerido={handleSlotSelected}
            />
          )}
        </div>
      </main>

      <ConfirmDrawer
        open={canchaSeleccionada !== null}
        cancha={canchaSeleccionada}
        slot={slot}
        complejoId={complejo._id}
        onSuccess={handleReservaExitosa}
        onClose={() => setCanchaSeleccionada(null)}
      />
    </div>
  );
}
