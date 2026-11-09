import type { MisionNueva } from "../types/mision.ts";

export type EntradaMision = {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number | null;
};

export type ResultadoMision =
  | { valida: true; mision: MisionNueva }
  | { valida: false; motivos: string[] };

export function validarMision(
  entrada: EntradaMision,
  hoy: string,
): ResultadoMision {
  const motivos: string[] = [];
  const naveId = entrada.naveId.trim();
  const destino = entrada.destino.trim();
  const fechaDespegue = entrada.fechaDespegue.trim();

  if (naveId.length === 0) {
    motivos.push("Falta la nave.");
  }
  if (destino.length === 0) {
    motivos.push("Falta el destino.");
  }
  if (fechaDespegue.length === 0) {
    motivos.push("Falta la fecha de despegue.");
  } else if (fechaDespegue < hoy) {
    motivos.push("La fecha de despegue no puede ser anterior a hoy.");
  }

  const duracion = entrada.duracionDias;
  if (duracion === null) {
    motivos.push("Falta la duración.");
  } else if (!Number.isInteger(duracion) || duracion < 1) {
    motivos.push(
      "La duración debe ser un número entero de días, como mínimo 1.",
    );
  }

  if (motivos.length > 0 || duracion === null) {
    return { valida: false, motivos };
  }

  return {
    valida: true,
    mision: {
      naveId,
      destino,
      fechaDespegue,
      duracionDias: duracion,
    },
  };
}
