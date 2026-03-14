import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdCheckCircle,
  MdEventBusy,
  MdLightbulb,
  MdSchedule,
  MdSportsSoccer,
  MdSportsTennis,
  MdStadium,
  MdStraighten,
} from "react-icons/md";
import type { Cancha } from "../api/complejos";
import styles from "./CanchasDisponibles.module.css";

interface Slot {
  fecha: string;
  hora: string;
}

interface CanchasDisponiblesProps {
  canchas: Cancha[];
  canchasDisponibles: string[];
  cargando: boolean;
  slot: Slot;
  horarioApertura: string;
  horarioCierre: string;
  onSeleccionarCancha: (cancha: Cancha) => void;
  onCambiarSlot: () => void;
  onSlotSugerido?: (slot: Slot) => void;
}

const TIPO_META: Record<
  string,
  { tag: string; dimensiones: string; descripcion: string }
> = {
  Padel: {
    tag: "PADEL",
    dimensiones: "20m x 10m",
    descripcion: "Paletas disponibles · Cristales reglamentarios",
  },
  "Futbol 5": {
    tag: "FUTBOL 5",
    dimensiones: "40m x 20m",
    descripcion: "Cesped sintetico · Arcos incluidos",
  },
  "Futbol 7": {
    tag: "FUTBOL 7",
    dimensiones: "65m x 45m",
    descripcion: "Cesped sintetico profesional · Arcos incluidos",
  },
};

function getMeta(tipo: string) {
  return (
    TIPO_META[tipo] ?? {
      tag: tipo.toUpperCase(),
      dimensiones: "Dimensiones estandar",
      descripcion: "Instalaciones de primera calidad",
    }
  );
}

function getIcono(tipo: string, size = 22) {
  if (tipo === "Padel") return <MdSportsTennis size={size} />;
  if (tipo.startsWith("Futbol")) return <MdSportsSoccer size={size} />;
  return <MdStadium size={size} />;
}

function formatearFecha(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function extraerHora(hora: string): number | null {
  const [hh] = hora.split(":");
  const parsed = Number(hh);
  return Number.isNaN(parsed) ? null : parsed;
}

function toHoraLabel(hora: number): string {
  return `${String(hora).padStart(2, "0")}:00`;
}

function Skeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {[1, 2, 3].map((k) => (
        <div key={k} className={styles.skeletonCard}>
          <div className={styles.skeletonStripe} />
          <div className={styles.skeletonBody}>
            <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonLineLong}`} />
            <div className={styles.skeletonBlock} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CanchasDisponibles({
  canchas,
  canchasDisponibles,
  cargando,
  slot,
  horarioApertura,
  horarioCierre,
  onSeleccionarCancha,
  onCambiarSlot,
  onSlotSugerido,
}: CanchasDisponiblesProps) {
  const [slotBannerStuck, setSlotBannerStuck] = useState(false);
  const stickySentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSlotBannerStuck(!entry.isIntersecting);
      },
      { threshold: [1] }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  const disponiblesCount = canchas.filter((c) => canchasDisponibles.includes(c._id ?? "")).length;
  const sinDisponibilidad = !cargando && disponiblesCount === 0;

  const sugerencias = useMemo(() => {
    const horaActual = extraerHora(slot.hora);
    const horaInicio = extraerHora(horarioApertura);
    const horaFin = extraerHora(horarioCierre);

    if (horaActual === null || horaInicio === null || horaFin === null) {
      return [] as Array<{ label: string; slot: Slot }>;
    }

    const horasCandidatas = [horaActual - 1, horaActual + 1];

    return horasCandidatas
      .filter((h) => h >= horaInicio && h <= horaFin)
      .map((h) => ({
        label: `${toHoraLabel(h)}hs`,
        slot: { fecha: slot.fecha, hora: toHoraLabel(h) },
      }));
  }, [horarioApertura, horarioCierre, slot.fecha, slot.hora]);

  const handleSugerencia = (nuevoSlot: Slot) => {
    onCambiarSlot();
    if (onSlotSugerido) {
      onSlotSugerido(nuevoSlot);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div ref={stickySentinelRef} className={styles.stickySentinel} aria-hidden="true" />

      <div className={`${styles.slotBanner} ${slotBannerStuck ? styles.slotBannerStuck : ""}`}>
        <div className={styles.slotInfo}>
          <span className={styles.slotBadge}>3</span>
          <div className={styles.slotTexto}>
            <p className={styles.slotLabel}>Tu turno</p>
            <p className={styles.slotValor}>
              {formatearFecha(slot.fecha)} · {slot.hora}hs
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.cambiarBtn}
          onClick={onCambiarSlot}
          aria-label="Cambiar fecha y hora"
        >
          <MdArrowBack size={15} />
          Cambiar
        </button>
      </div>

      {cargando ? (
        <Skeleton />
      ) : (
        <>
          {sinDisponibilidad ? (
            <section className={styles.emptyState} aria-live="polite">
              <MdEventBusy size={48} aria-hidden="true" />
              <p className={styles.emptyTitle}>No hay canchas libres a las {slot.hora}hs</p>
              <p className={styles.emptySubtext}>Proba con otro horario</p>
              <div className={styles.emptyActions}>
                {sugerencias.map((sugerida) => (
                  <button
                    key={sugerida.slot.hora}
                    type="button"
                    className={styles.sugerenciaChip}
                    onClick={() => handleSugerencia(sugerida.slot)}
                  >
                    {sugerida.label}
                  </button>
                ))}

                {sugerencias.length === 0 && (
                  <button
                    type="button"
                    className={styles.cambiarHorarioBtn}
                    onClick={onCambiarSlot}
                  >
                    Cambiar horario
                  </button>
                )}
              </div>
            </section>
          ) : (
            <p className={styles.resumenDisponibilidad} aria-live="polite">
              {`${disponiblesCount} de ${canchas.length} canchas disponibles`}
            </p>
          )}

          <div className={styles.canchasGrid} role="list" aria-label="Listado de canchas del complejo">
            {canchas.map((cancha, index) => {
              const disponible = canchasDisponibles.includes(cancha._id ?? "");
              const meta = getMeta(cancha.tipoCancha);

              return (
                <article
                  key={cancha._id ?? index}
                  role="listitem"
                  className={`${styles.card} ${!disponible ? styles.cardOcupada : ""}`}
                  onClick={() => disponible && onSeleccionarCancha(cancha)}
                  aria-disabled={!disponible}
                >
                  <div
                    className={`${styles.stripe} ${disponible ? styles.stripeVerde : styles.stripeGris}`}
                  />

                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <div
                        className={`${styles.iconWrap} ${
                          disponible ? styles.iconVerde : styles.iconGris
                        }`}
                      >
                        {getIcono(cancha.tipoCancha)}
                      </div>

                      <div className={styles.nameGroup}>
                        <span className={`${styles.tipoTag} ${disponible ? styles.tipoTagVerde : ""}`}>
                          {meta.tag}
                        </span>
                        <h3 className={styles.canchaNombre}>{cancha.nombre ?? `Cancha ${index + 1}`}</h3>
                      </div>

                      <div
                        className={`${styles.estadoBadge} ${
                          disponible ? styles.estadoDisponible : styles.estadoOcupada
                        }`}
                        aria-label={disponible ? "Disponible" : "Ocupada en este horario"}
                      >
                        {disponible ? (
                          <>
                            <MdCheckCircle size={13} />
                            Disponible
                          </>
                        ) : (
                          <>
                            <MdSchedule size={13} />
                            Ocupada
                          </>
                        )}
                      </div>
                    </div>

                    <div className={styles.specs}>
                      <span className={styles.specItem}>
                        <MdStraighten size={13} />
                        {meta.dimensiones}
                      </span>
                      <span className={styles.specItem}>
                        <MdLightbulb size={13} />
                        Iluminacion LED
                      </span>
                      <span className={styles.specItem}>
                        {getIcono(cancha.tipoCancha, 13)}
                        {meta.descripcion}
                      </span>
                    </div>

                    <div className={styles.cardFooter}>
                      <div>
                        <p className={styles.precioLabel}>por hora</p>
                        <p className={styles.precio}>${cancha.precioHora.toLocaleString("es-AR")}</p>
                      </div>

                      {disponible && (
                        <button
                          type="button"
                          className={styles.reservarBtn}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSeleccionarCancha(cancha);
                          }}
                        >
                          Reservar
                          <MdArrowForward size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
