import type { ClaseNave, NaveNueva } from "../types/nave.ts";

export type EntradaNave = {
  nombre: string;
  clase: string;
  combustible: number | null;
};

export type ResultadoNave =
  | { valida: true; nave: NaveNueva }
  | { valida: false; motivos: string[] };

const clases: readonly ClaseNave[] = ["exploradora", "carguera", "transporte"];

function esClase(valor: string): valor is ClaseNave {
  return clases.some((clase) => clase === valor);
}

export function validarNave(
  entrada: EntradaNave,
  nombresExistentes: readonly string[],
  fechaRegistro: string,
): ResultadoNave {
  const motivos: string[] = [];
  const nombre = entrada.nombre.trim();

  if (nombre.length === 0) {
    motivos.push("Falta el nombre.");
  } else {
    const comparacion = nombre.toLocaleLowerCase("es");
    const repetido = nombresExistentes.some(
      (existente) => existente.trim().toLocaleLowerCase("es") === comparacion,
    );
    if (repetido) {
      motivos.push("Ya existe una nave con ese nombre.");
    }
  }

  const clase = entrada.clase.trim();
  if (clase.length === 0) {
    motivos.push("Falta la clase.");
  } else if (!esClase(clase)) {
    motivos.push("La clase debe ser exploradora, carguera o transporte.");
  }

  const combustible = entrada.combustible;
  if (combustible === null) {
    motivos.push("Falta el combustible.");
  } else if (
    !Number.isInteger(combustible) ||
    combustible < 0 ||
    combustible > 100
  ) {
    motivos.push("El combustible debe ser un entero entre 0 y 100.");
  }

  if (motivos.length > 0 || !esClase(clase) || combustible === null) {
    return { valida: false, motivos };
  }

  return {
    valida: true,
    nave: {
      nombre,
      clase,
      combustible,
      enReparacion: false,
      ultimaRevision: fechaRegistro,
    },
  };
}
