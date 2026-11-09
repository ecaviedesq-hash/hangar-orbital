import { validarNave } from "../dominio/validarNave.ts";
import type { EntradaNave } from "../dominio/validarNave.ts";
import { supabase } from "../lib/supabase.ts";
import type { ClaseNave, Nave } from "../types/nave.ts";

export type ResultadoCrearNave =
  | { ok: true; nave: Nave }
  | { ok: false; motivos: string[] };

const columnas =
  "id, nombre, clase, combustible, en_reparacion, ultima_revision, created_at";

function esClase(valor: unknown): valor is ClaseNave {
  return (
    valor === "exploradora" || valor === "carguera" || valor === "transporte"
  );
}

function aNave(valor: unknown): Nave | null {
  if (typeof valor !== "object" || valor === null) return null;
  const fila = valor as Record<string, unknown>;
  if (
    typeof fila.id !== "string" ||
    typeof fila.nombre !== "string" ||
    !esClase(fila.clase) ||
    typeof fila.combustible !== "number" ||
    typeof fila.en_reparacion !== "boolean" ||
    typeof fila.ultima_revision !== "string" ||
    typeof fila.created_at !== "string"
  ) {
    return null;
  }
  return {
    id: fila.id,
    nombre: fila.nombre,
    clase: fila.clase,
    combustible: fila.combustible,
    enReparacion: fila.en_reparacion,
    ultimaRevision: fila.ultima_revision,
    createdAt: fila.created_at,
  };
}

export const navesService = {
  async listar(): Promise<Nave[]> {
    const { data, error } = await supabase
      .from("naves")
      .select(columnas)
      .order("created_at", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    const filas: unknown[] = Array.isArray(data) ? data : [];
    return filas.flatMap((fila) => {
      const nave = aNave(fila);
      return nave ? [nave] : [];
    });
  },

  async crear(entrada: EntradaNave): Promise<ResultadoCrearNave> {
    const existentes = await navesService.listar();
    const fechaRegistro = new Date().toISOString();
    const validacion = validarNave(
      entrada,
      existentes.map((nave) => nave.nombre),
      fechaRegistro,
    );
    if (!validacion.valida) {
      return { ok: false, motivos: validacion.motivos };
    }

    const { data, error } = await supabase
      .from("naves")
      .insert({
        nombre: validacion.nave.nombre,
        clase: validacion.nave.clase,
        combustible: validacion.nave.combustible,
        en_reparacion: validacion.nave.enReparacion,
        ultima_revision: validacion.nave.ultimaRevision,
      })
      .select(columnas)
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          ok: false,
          motivos: ["Ya existe una nave con ese nombre."],
        };
      }
      throw new Error(error.message);
    }

    const nave = aNave(data);
    if (!nave) {
      throw new Error("La nave guardada no tiene el formato esperado.");
    }
    return { ok: true, nave };
  },
};
