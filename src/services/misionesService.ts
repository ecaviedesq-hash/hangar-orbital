import { puedeRecibirMision } from "../dominio/puedeRecibirMision.ts";
import { validarMision } from "../dominio/validarMision.ts";
import type { EntradaMision } from "../dominio/validarMision.ts";
import { supabase } from "../lib/supabase.ts";
import type { Mision } from "../types/mision.ts";
import type { Nave } from "../types/nave.ts";

export type ResultadoCrearMision =
  | { ok: true; mision: Mision }
  | { ok: false; motivos: string[] };

const columnas =
  "id, nave_id, destino, fecha_despegue, duracion_dias, created_at";

function fechaHoy(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

function aMision(valor: unknown): Mision | null {
  if (typeof valor !== "object" || valor === null) return null;
  const fila = valor as Record<string, unknown>;
  if (
    typeof fila.id !== "string" ||
    typeof fila.nave_id !== "string" ||
    typeof fila.destino !== "string" ||
    typeof fila.fecha_despegue !== "string" ||
    typeof fila.duracion_dias !== "number" ||
    typeof fila.created_at !== "string"
  ) {
    return null;
  }
  return {
    id: fila.id,
    naveId: fila.nave_id,
    destino: fila.destino,
    fechaDespegue: fila.fecha_despegue,
    duracionDias: fila.duracion_dias,
    createdAt: fila.created_at,
  };
}

export const misionesService = {
  async listar(): Promise<Mision[]> {
    const { data, error } = await supabase
      .from("misiones")
      .select(columnas)
      .order("created_at", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    const filas: unknown[] = Array.isArray(data) ? data : [];
    return filas.flatMap((fila) => {
      const mision = aMision(fila);
      return mision ? [mision] : [];
    });
  },

  async contarDesdeRevision(
    naveId: string,
    ultimaRevision: string,
  ): Promise<number> {
    const { count, error } = await supabase
      .from("misiones")
      .select("id", { count: "exact", head: true })
      .eq("nave_id", naveId)
      .gte("created_at", ultimaRevision);
    if (error) {
      throw new Error(error.message);
    }
    return count ?? 0;
  },

  async crear(
    entrada: EntradaMision,
    naves: readonly Nave[],
  ): Promise<ResultadoCrearMision> {
    const validacion = validarMision(entrada, fechaHoy());
    if (!validacion.valida) {
      return { ok: false, motivos: validacion.motivos };
    }

    const nave = naves.find((item) => item.id === validacion.mision.naveId);
    if (!nave) {
      return { ok: false, motivos: ["Falta la nave."] };
    }

    const cantidad = await misionesService.contarDesdeRevision(
      nave.id,
      nave.ultimaRevision,
    );
    const decision = puedeRecibirMision(nave, cantidad);
    if (!decision.puede) {
      return { ok: false, motivos: [decision.motivo] };
    }

    const { data, error } = await supabase
      .from("misiones")
      .insert({
        nave_id: validacion.mision.naveId,
        destino: validacion.mision.destino,
        fecha_despegue: validacion.mision.fechaDespegue,
        duracion_dias: validacion.mision.duracionDias,
      })
      .select(columnas)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const mision = aMision(data);
    if (!mision) {
      throw new Error("La misión guardada no tiene el formato esperado.");
    }
    return { ok: true, mision };
  },
};
