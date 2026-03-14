import { useEffect, useState } from "react";
import { fetchDisponibilidad } from "../api/complejos";

interface UseDisponibilidadState {
  canchasDisponibles: string[];
  cargando: boolean;
  error: string | null;
}

export function useDisponibilidad(
  complejoId?: string | null,
  fecha?: string | null,
  hora?: string | null
): UseDisponibilidadState {
  const [canchasDisponibles, setCanchasDisponibles] = useState<string[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!complejoId || !fecha || !hora) {
      setCanchasDisponibles([]);
      setCargando(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setCargando(true);
      setError(null);

      try {
        const data = await fetchDisponibilidad(complejoId, fecha, hora);
        if (!cancelled) {
          setCanchasDisponibles(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Error al consultar disponibilidad";
          setError(message);
          setCanchasDisponibles([]);
        }
      } finally {
        if (!cancelled) {
          setCargando(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [complejoId, fecha, hora]);

  return { canchasDisponibles, cargando, error };
}
