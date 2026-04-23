const TIMEZONE_ARGENTINA = "America/Argentina/Buenos_Aires";

type FechaParts = {
  year: number;
  month: number;
  day: number;
};

export function normalizarTipoCancha(tipoCancha: string): string {
  const clean = tipoCancha.trim().toLowerCase();

  if (/^futbol\s*5$/.test(clean)) return "Futbol 5";
  if (/^futbol\s*7$/.test(clean)) return "Futbol 7";
  if (/^padel$/.test(clean)) return "Padel";

  return tipoCancha.trim();
}

export function getDuracionMinutosPorTipoCancha(tipoCancha: string): number {
  return /^padel$/i.test(normalizarTipoCancha(tipoCancha)) ? 90 : 60;
}

export function validarHora(hora: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

export function horaToMinutos(hora: string): number {
  const [hh, mm] = hora.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) {
    throw new Error("Hora invalida");
  }

  return hh * 60 + mm;
}

export function minutosToHora(totalMinutos: number): string {
  const minutosNormalizados = ((totalMinutos % 1440) + 1440) % 1440;
  const horas = Math.floor(minutosNormalizados / 60);
  const minutos = minutosNormalizados % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

export function sumarMinutosAHora(hora: string, minutos: number): string {
  return minutosToHora(horaToMinutos(hora) + minutos);
}

export function seSuperponenIntervalos(
  inicioA: string,
  finA: string,
  inicioB: string,
  finB: string
): boolean {
  const inicioAMin = horaToMinutos(inicioA);
  const finAMin = horaToMinutos(finA);
  const inicioBMin = horaToMinutos(inicioB);
  const finBMin = horaToMinutos(finB);

  return inicioAMin < finBMin && inicioBMin < finAMin;
}

export function parseFechaISO(fechaISO: string): FechaParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaISO);
  if (!match) {
    throw new Error("Fecha invalida. Formato esperado: YYYY-MM-DD");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!year || !month || !day) {
    throw new Error("Fecha invalida");
  }

  return { year, month, day };
}

export function getRangoUTCDeFechaISO(fechaISO: string): { inicio: Date; fin: Date } {
  const { year, month, day } = parseFechaISO(fechaISO);

  const inicio = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const fin = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  return { inicio, fin };
}

export function fechaISOToUTCMediodia(fechaISO: string): Date {
  const { year, month, day } = parseFechaISO(fechaISO);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
}

export function formatearFechaHoraArgentina(fecha: Date): string {
  const formatter = new Intl.DateTimeFormat("es-AR", {
    timeZone: TIMEZONE_ARGENTINA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formatter.format(fecha);
}

export function formatearFechaISOArgentina(fecha: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE_ARGENTINA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(fecha);
}
