import { describe, expect, it } from "vitest";
import { validarMision } from "./validarMision.ts";

const hoy = "2026-11-09";

describe("validarMision", () => {
  it("acepta una misión con fecha de hoy", () => {
    const resultado = validarMision(
      {
        naveId: "nave-1",
        destino: "Órbita baja",
        fechaDespegue: hoy,
        duracionDias: 2,
      },
      hoy,
    );
    expect(resultado).toEqual({
      valida: true,
      mision: {
        naveId: "nave-1",
        destino: "Órbita baja",
        fechaDespegue: hoy,
        duracionDias: 2,
      },
    });
  });

  it("indica qué falta si no hay nave, destino, fecha o duración", () => {
    const resultado = validarMision(
      { naveId: "", destino: " ", fechaDespegue: "", duracionDias: null },
      hoy,
    );
    expect(resultado).toEqual({
      valida: false,
      motivos: [
        "Falta la nave.",
        "Falta el destino.",
        "Falta la fecha de despegue.",
        "Falta la duración.",
      ],
    });
  });

  it("rechaza una fecha anterior a hoy", () => {
    const resultado = validarMision(
      {
        naveId: "nave-1",
        destino: "Luna",
        fechaDespegue: "2026-11-08",
        duracionDias: 1,
      },
      hoy,
    );
    expect(resultado.valida).toBe(false);
    if (!resultado.valida) {
      expect(resultado.motivos).toContain(
        "La fecha de despegue no puede ser anterior a hoy.",
      );
    }
  });

  it("rechaza una duración que no es un entero de al menos 1 día", () => {
    const resultado = validarMision(
      {
        naveId: "nave-1",
        destino: "Luna",
        fechaDespegue: hoy,
        duracionDias: 0,
      },
      hoy,
    );
    expect(resultado.valida).toBe(false);
    if (!resultado.valida) {
      expect(resultado.motivos).toContain(
        "La duración debe ser un número entero de días, como mínimo 1.",
      );
    }
  });
});
