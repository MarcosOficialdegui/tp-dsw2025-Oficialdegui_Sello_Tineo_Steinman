export const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export interface Cancha {
  _id: string;
  nombre?: string;
  tipoCancha: string;
  precioHora: number;
  disponible: boolean;
}

export interface Complejo {
  _id: string;
  nombre: string;
  direccion: string;
  ciudad: { _id: string; nombre: string };
  servicios: string[];
  canchas: Cancha[];
  horarioApertura: string;
  horarioCierre: string;
}

export interface ReservaPayload {
  complejoId: string;
  canchaId: string;
  canchaTipo: string;
  fecha: string;
  horaInicio: string;
}

interface ServerError {
  error?: string;
  message?: string;
  mensaje?: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

function getServerMessage(payload: ServerError, fallback: string): string {
  return payload.error ?? payload.message ?? payload.mensaje ?? fallback;
}

export async function fetchComplejo(id: string): Promise<Complejo> {
  const response = await fetch(`${BASE}/complejos/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const payload = await parseJson<ServerError>(response);
    throw new Error(getServerMessage(payload, "No se pudo obtener el complejo"));
  }

  return parseJson<Complejo>(response);
}

export async function fetchDisponibilidad(
  complejoId: string,
  fecha: string,
  hora: string
): Promise<string[]> {
  const query = new URLSearchParams({ fecha, hora }).toString();
  const response = await fetch(`${BASE}/complejos/${complejoId}/disponibilidad?${query}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const payload = await parseJson<ServerError>(response);
    throw new Error(getServerMessage(payload, "No se pudo obtener la disponibilidad"));
  }

  const data = await parseJson<{ canchasDisponibles?: string[] }>(response);
  return data.canchasDisponibles ?? [];
}

export async function crearReserva(
  payload: ReservaPayload
): Promise<{ mensaje: string }> {
  const response = await fetch(`${BASE}/reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      complejo: payload.complejoId,
      canchaId: payload.canchaId,
      canchaTipo: payload.canchaTipo,
      fecha: payload.fecha,
      horaInicio: payload.horaInicio,
    }),
  });

  if (!response.ok) {
    const errorPayload = await parseJson<ServerError>(response);
    throw new Error(getServerMessage(errorPayload, "No se pudo crear la reserva"));
  }

  const data = await parseJson<ServerError>(response);
  return { mensaje: data.mensaje ?? data.message ?? "Reserva creada exitosamente" };
}
