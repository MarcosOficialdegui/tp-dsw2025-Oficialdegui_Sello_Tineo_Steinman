import { useEffect, useState } from "react";
import { fetchComplejo, type Complejo } from "../api/complejos";

interface UseComplejoState {
  complejo: Complejo | null;
  cargando: boolean;
  error: string | null;
}

export function useComplejo(id?: string): UseComplejoState {
  const [complejo, setComplejo] = useState<Complejo | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setComplejo(null);
      setCargando(false);
      setError("ID de complejo inválido");
      return;
    }

    let cancelled = false;

    const run = async () => {
      setCargando(true);
      setError(null);

      try {
        const data = await fetchComplejo(id);
        if (!cancelled) {
          setComplejo(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Error al cargar el complejo";
          setError(message);
          setComplejo(null);
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
  }, [id]);

  return { complejo, cargando, error };
}
