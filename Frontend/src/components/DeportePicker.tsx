import { useEffect, useMemo, useState } from "react";
import { MdSportsSoccer, MdSportsTennis, MdStadium } from "react-icons/md";
import type { Cancha } from "../api/complejos";
import styles from "./DeportePicker.module.css";

interface DeportePickerProps {
  canchas: Cancha[];
  onDeporteSeleccionado: (tipoCancha: string) => void;
}

const ORDEN_PRIORITARIO = ["Padel", "Futbol 5", "Futbol 7"] as const;

function normalizarTipo(tipo: string): string {
  const limpio = tipo.trim();
  const sinTildes = limpio.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const simplificado = sinTildes.replace(/\s+/g, " ");

  if (/^padel$/i.test(simplificado)) return "Padel";
  if (/^futbol\s*5$/i.test(simplificado)) return "Futbol 5";
  if (/^futbol\s*7$/i.test(simplificado)) return "Futbol 7";

  return limpio;
}

function ordenarTipos(tipos: string[]): string[] {
  const prioridad = new Map<string, number>(ORDEN_PRIORITARIO.map((tipo, i) => [tipo, i]));

  return [...tipos].sort((a, b) => {
    const ordenA = prioridad.get(a);
    const ordenB = prioridad.get(b);

    if (ordenA !== undefined && ordenB !== undefined) {
      return ordenA - ordenB;
    }

    if (ordenA !== undefined) return -1;
    if (ordenB !== undefined) return 1;

    return a.localeCompare(b, "es", { sensitivity: "base" });
  });
}

function obtenerJugadores(tipoCancha: string): string | null {
  if (tipoCancha === "Padel") return "4 jugadores";
  if (tipoCancha === "Futbol 5") return "10 jugadores";
  if (tipoCancha === "Futbol 7") return "14 jugadores";
  return null;
}

function obtenerIcono(tipoCancha: string) {
  if (tipoCancha === "Padel") return <MdSportsTennis size={36} aria-hidden="true" />;
  if (tipoCancha === "Futbol 5") return <MdSportsSoccer size={36} aria-hidden="true" />;
  if (tipoCancha === "Futbol 7") return <MdSportsSoccer size={36} aria-hidden="true" />;
  return <MdStadium size={36} aria-hidden="true" />;
}

export default function DeportePicker({ canchas, onDeporteSeleccionado }: DeportePickerProps) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const canchasPorTipo = useMemo(() => {
    const agrupadas = new Map<string, Cancha[]>();

    canchas.forEach((cancha) => {
      const tipo = normalizarTipo(cancha.tipoCancha);
      const existentes = agrupadas.get(tipo) ?? [];
      existentes.push(cancha);
      agrupadas.set(tipo, existentes);
    });

    return agrupadas;
  }, [canchas]);

  const deportes = useMemo(() => {
    const tipos = [...new Set(canchas.map((cancha) => normalizarTipo(cancha.tipoCancha)))];
    return ordenarTipos(tipos);
  }, [canchas]);

  useEffect(() => {
    if (deportes.length === 1) {
      onDeporteSeleccionado(deportes[0]);
    }
  }, []);

  const seleccionar = (tipoCancha: string, disponible: boolean) => {
    if (!disponible) return;

    setSeleccionado(tipoCancha);
    window.setTimeout(() => {
      onDeporteSeleccionado(tipoCancha);
    }, 140);
  };

  if (deportes.length <= 1) {
    return null;
  }

  return (
    <section className={styles.wrapper} aria-label="Paso 1: elegir deporte">
      <header className={styles.sectionHeader}>
        <span className={styles.badge} aria-hidden="true">
          1
        </span>
        <div>
          <h2 className={styles.title}>¿Qué deporte querés jugar?</h2>
          <p className={styles.subtitle}>Seleccioná el tipo de cancha para ver disponibilidad</p>
        </div>
      </header>

      <div className={styles.grid} role="radiogroup" aria-label="Selección de deporte">
        {deportes.map((tipoCancha, index) => {
          const canchasTipo = canchasPorTipo.get(tipoCancha) ?? [];
          const disponibles = canchasTipo.filter((cancha) => cancha.disponible).length;
          const precioMinimo = canchasTipo.reduce<number | null>((min, cancha) => {
            if (min === null) return cancha.precioHora;
            return cancha.precioHora < min ? cancha.precioHora : min;
          }, null);

          const disabled = disponibles === 0;
          const jugadores = obtenerJugadores(tipoCancha);
          const isSelected = seleccionado === tipoCancha;

          return (
            <div
              key={tipoCancha}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              className={`${styles.card} ${disabled ? styles.cardDisabled : ""} ${
                isSelected ? styles.cardSelected : ""
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => seleccionar(tipoCancha, !disabled)}
              onKeyDown={(event) => {
                if (disabled) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  seleccionar(tipoCancha, true);
                }
              }}
            >
              <div className={`${styles.stripe} ${disabled ? styles.stripeDisabled : styles.stripeEnabled}`} />

              <div className={styles.iconWrap}>{obtenerIcono(tipoCancha)}</div>
              <h3 className={styles.cardTitle}>{tipoCancha}</h3>

              {disabled ? (
                <p className={styles.unavailable}>Sin disponibilidad hoy</p>
              ) : (
                <p className={styles.availableCount}>{`${disponibles} cancha(s) disponible(s)`}</p>
              )}

              {jugadores && <p className={styles.players}>{jugadores}</p>}

              {precioMinimo !== null && (
                <p className={styles.price}>{`$${precioMinimo.toLocaleString("es-AR")} / hora`}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
