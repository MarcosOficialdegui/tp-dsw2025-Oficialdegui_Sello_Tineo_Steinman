/**
 * ConfirmDrawer.tsx
 *
 * Paso final: drawer deslizable desde abajo (mobile) / modal centrado (desktop)
 * que muestra el resumen de la reserva y ejecuta el POST.
 *
 * Maneja sus propios estados de loading/error/success para que el padre
 * no necesite saber nada de la llamada HTTP.
 */

import { useState, useEffect, useCallback } from "react";
import { MdClose, MdCheckCircle, MdErrorOutline, MdCalendarMonth, MdAccessTime, MdSportsSoccer } from "react-icons/md";
import { crearReserva } from "../api/complejos";
import type { Cancha } from "../api/complejos";
import { mostrarError } from "../utils/notificaciones";
import styles from "./ConfirmDrawer.module.css";

// ─── tipos ──────────────────────────────────────────────────────────────────

interface ConfirmDrawerProps {
  open: boolean;
  cancha: Cancha | null;
  slot: { fecha: string; hora: string } | null;
  complejoId: string;
  onSuccess: () => void;
  onClose: () => void;
}

type Estado = "idle" | "loading" | "success" | "error";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatearFechaLarga(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── componente ──────────────────────────────────────────────────────────────

export default function ConfirmDrawer({
  open,
  cancha,
  slot,
  complejoId,
  onSuccess,
  onClose,
}: ConfirmDrawerProps) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Resetear estado al abrir
  useEffect(() => {
    if (open) {
      setEstado("idle");
      setErrorMsg("");
    }
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && estado !== "loading") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, estado, onClose]);

  // Bloquear scroll del body mientras el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleConfirmar = useCallback(async () => {
    if (!cancha || !slot || estado === "loading") return;

    setEstado("loading");
    setErrorMsg("");

    try {
      await crearReserva({
        complejoId,
        canchaId: cancha._id!,
        canchaTipo: cancha.tipoCancha,
        fecha: slot.fecha,
        horaInicio: slot.hora,
      });
      setEstado("success");
      // Dar tiempo a que el usuario vea el éxito antes de cerrar
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear la reserva";
      setErrorMsg(msg);
      mostrarError(msg);
      setEstado("error");
    }
  }, [cancha, slot, complejoId, estado, onSuccess, onClose]);

  if (!open || !cancha || !slot) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={styles.overlay}
        onClick={() => estado !== "loading" && onClose()}
        aria-hidden="true"
      />

      {/* Drawer / modal */}
      <div
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar reserva"
      >
        {/* Handle (solo visible en mobile) */}
        <div className={styles.handle} aria-hidden="true" />

        {/* Header */}
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Confirmá tu reserva</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={estado === "loading"}
            aria-label="Cerrar"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Contenido principal */}
        <div className={styles.drawerBody}>
          {/* Resumen */}
          <div className={styles.resumen}>
            <div className={styles.resumenItem}>
              <MdCalendarMonth size={18} className={styles.resumenIcon} />
              <div>
                <p className={styles.resumenLabel}>Fecha</p>
                <p className={styles.resumenValor}>{formatearFechaLarga(slot.fecha)}</p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.resumenItem}>
              <MdAccessTime size={18} className={styles.resumenIcon} />
              <div>
                <p className={styles.resumenLabel}>Hora</p>
                <p className={styles.resumenValor}>{slot.hora}hs — {String(parseInt(slot.hora) + 1).padStart(2, "0")}:00hs</p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.resumenItem}>
              <MdSportsSoccer size={18} className={styles.resumenIcon} />
              <div>
                <p className={styles.resumenLabel}>Cancha</p>
                <p className={styles.resumenValor}>
                  {cancha.nombre ?? `Cancha · ${cancha.tipoCancha}`}
                </p>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className={styles.precioRow}>
            <span className={styles.precioLabel}>Total estimado</span>
            <span className={styles.precioValor}>
              ${cancha.precioHora.toLocaleString("es-AR")}
            </span>
          </div>

          {/* Mensaje de error */}
          {estado === "error" && (
            <div className={styles.errorMsg} role="alert">
              <MdErrorOutline size={18} />
              {errorMsg}
            </div>
          )}

          {/* Mensaje de éxito */}
          {estado === "success" && (
            <div className={styles.successMsg} role="status">
              <MdCheckCircle size={20} />
              ¡Reserva confirmada! Te esperamos.
            </div>
          )}
        </div>

        {/* Footer con CTA */}
        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.cancelarBtn}
            onClick={onClose}
            disabled={estado === "loading" || estado === "success"}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={`${styles.confirmarBtn} ${estado === "loading" ? styles.confirmarBtnLoading : ""} ${estado === "success" ? styles.confirmarBtnSuccess : ""}`}
            onClick={handleConfirmar}
            disabled={estado === "loading" || estado === "success"}
            aria-busy={estado === "loading"}
          >
            {estado === "loading" && (
              <span className={styles.spinner} aria-hidden="true" />
            )}
            {estado === "success" && <MdCheckCircle size={18} />}
            {estado === "idle" || estado === "error" ? "Confirmar reserva" : ""}
            {estado === "loading" ? "Confirmando..." : ""}
            {estado === "success" ? "Confirmada" : ""}
          </button>
        </div>
      </div>
    </>
  );
}
