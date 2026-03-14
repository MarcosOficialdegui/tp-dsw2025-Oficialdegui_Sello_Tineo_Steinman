import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  MdAccessTime,
  MdNightsStay,
  MdSportsSoccer,
  MdWbSunny,
} from "react-icons/md";
import type { IconType } from "react-icons";
import styles from "./SlotPicker.module.css";

interface Slot {
  fecha: string;
  hora: string;
}

interface SlotPickerProps {
  horarioApertura: string;
  horarioCierre: string;
  fechaInicial?: string;
  deporteLabel?: string;
  onSlotSelected: (slot: Slot) => void;
}

interface DiaItem {
  iso: string;
  dia: number;
  mes: string;
  semana: string;
  esHoy: boolean;
}

type Periodo = "mañana" | "tarde" | "noche";

const PERIODO_RANGOS: Record<Periodo, [number, number]> = {
  mañana: [6, 12],
  tarde: [13, 18],
  noche: [19, 23],
};

const PERIODO_ICONOS: Record<Periodo, IconType> = {
  mañana: MdWbSunny,
  tarde: MdWbSunny,
  noche: MdNightsStay,
};

function generarDias(cantidad = 14): DiaItem[] {
  const hoy = new Date();
  return Array.from({ length: cantidad }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    return {
      iso: d.toISOString().split("T")[0],
      dia: d.getDate(),
      mes: d.toLocaleDateString("es-ES", { month: "short" }),
      semana: d.toLocaleDateString("es-ES", { weekday: "short" }),
      esHoy: i === 0,
    };
  });
}

function generarHorarios(apertura: string, cierre: string): string[] {
  const [desde] = apertura.split(":").map(Number);
  const [hasta] = cierre.split(":").map(Number);

  if (Number.isNaN(desde) || Number.isNaN(hasta) || hasta < desde) {
    return [];
  }

  return Array.from(
    { length: hasta - desde + 1 },
    (_, i) => `${String(desde + i).padStart(2, "0")}:00`
  );
}

export default function SlotPicker({
  horarioApertura,
  horarioCierre,
  fechaInicial,
  deporteLabel,
  onSlotSelected,
}: SlotPickerProps) {
  const [fecha, setFecha] = useState<string | null>(fechaInicial ?? null);
  const [hora, setHora] = useState<string | null>(null);
  const hoyButtonRef = useRef<HTMLButtonElement | null>(null);

  const dias = useMemo(() => generarDias(14), []);

  const horariosPorPeriodo = useMemo(() => {
    const todos = generarHorarios(horarioApertura, horarioCierre);
    const result: Partial<Record<Periodo, string[]>> = {};

    (Object.entries(PERIODO_RANGOS) as Array<[Periodo, [number, number]]>).forEach(
      ([periodo, [desde, hasta]]) => {
        const slots = todos.filter((h) => {
          const num = parseInt(h, 10);
          return num >= desde && num <= hasta;
        });

        if (slots.length > 0) {
          result[periodo] = slots;
        }
      }
    );

    return result;
  }, [horarioApertura, horarioCierre]);

  useEffect(() => {
    if (!fechaInicial) return;
    setFecha(fechaInicial);
  }, [fechaInicial]);

  useEffect(() => {
    if (!hoyButtonRef.current) return;

    hoyButtonRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, []);

  const handleFecha = useCallback((iso: string) => {
    setFecha(iso);
    setHora(null);
  }, []);

  const handleHora = useCallback(
    (h: string) => {
      setHora(h);
      if (fecha) {
        onSlotSelected({ fecha, hora: h });
      }
    },
    [fecha, onSlotSelected]
  );

  const diaSeleccionado = dias.find((d) => d.iso === fecha);

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>1</span>
          <h2 className={styles.sectionTitle}>¿Cuándo querés jugar?</h2>
        </div>

        {deporteLabel && (
          <div
            style={{
              background: "#edf7ed",
              border: "1px solid #c8e6c9",
              color: "#2d6a35",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 12px",
              marginBottom: "0.5rem",
              width: "fit-content",
            }}
          >
            <MdSportsSoccer size={14} aria-hidden="true" />
            {deporteLabel}
          </div>
        )}

        <div className={styles.diasStrip} role="group" aria-label="Selección de fecha">
          {dias.map((d) => (
            <button
              key={d.iso}
              ref={d.esHoy ? hoyButtonRef : null}
              type="button"
              role="radio"
              aria-checked={fecha === d.iso}
              className={`${styles.diaBtn} ${fecha === d.iso ? styles.diaBtnActive : ""}`}
              onClick={() => handleFecha(d.iso)}
            >
              {d.esHoy && <span className={styles.hoyDot} aria-hidden="true" />}
              <span className={styles.diaSemana}>{d.esHoy ? "Hoy" : d.semana}</span>
              <span className={styles.diaNro}>{d.dia}</span>
              <span className={styles.diaMes}>{d.mes}</span>
            </button>
          ))}
        </div>
      </section>

      {fecha && (
        <section className={styles.section} data-reveal>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>2</span>
            <div className={styles.sectionTitleWrap}>
              <h2 className={styles.sectionTitle}>¿A qué hora?</h2>
              <p className={styles.horarioInfo}>
                <MdAccessTime size={14} aria-hidden="true" />
                <span>
                  Horario del complejo: {horarioApertura} - {horarioCierre}hs
                </span>
              </p>
            </div>

            {diaSeleccionado && (
              <span className={styles.fechaChip} aria-live="polite">
                {diaSeleccionado.esHoy ? "Hoy" : diaSeleccionado.semana} {diaSeleccionado.dia}{" "}
                {diaSeleccionado.mes}
              </span>
            )}
          </div>

          <div className={styles.periodosGrid}>
            {(Object.entries(horariosPorPeriodo) as Array<[Periodo, string[]]>).map(
              ([periodo, slots]) => {
                const IconoPeriodo = PERIODO_ICONOS[periodo];
                return (
                  <div key={periodo} className={styles.periodo}>
                    <p className={styles.periodoLabel}>
                      <IconoPeriodo size={16} aria-hidden="true" />
                      <span>{periodo.charAt(0).toUpperCase() + periodo.slice(1)}</span>
                    </p>

                    <div className={styles.horasGrid} role="group" aria-label={`Horarios de ${periodo}`}>
                      {slots.map((h) => (
                        <button
                          key={h}
                          type="button"
                          role="radio"
                          aria-checked={hora === h}
                          className={`${styles.horaBtn} ${hora === h ? styles.horaBtnActive : ""}`}
                          onClick={() => handleHora(h)}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}
    </div>
  );
}
