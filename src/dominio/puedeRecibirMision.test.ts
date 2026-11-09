import { describe, expect, it } from "vitest";
import { puedeRecibirMision } from "./puedeRecibirMision.ts";

describe("puedeRecibirMision", () => {
  it("permite la misión y no cambia el combustible", () => {
    const nave = { combustible: 80, enReparacion: false };
    const decision = puedeRecibirMision(nave, 2);
    expect(decision).toEqual({ puede: true });
    expect(nave.combustible).toBe(80);
  });

  it("rechaza una nave en reparación antes que el combustible", () => {
    const decision = puedeRecibirMision(
      { combustible: 10, enReparacion: true },
      0,
    );
    expect(decision).toEqual({
      puede: false,
      motivo: "La nave está en reparación y no puede recibir misiones.",
    });
  });

  it("rechaza poco combustible y acepta exactamente 25", () => {
    expect(
      puedeRecibirMision({ combustible: 24, enReparacion: false }, 0),
    ).toEqual({
      puede: false,
      motivo:
        "La nave no tiene combustible suficiente (hace falta al menos 25 %).",
    });
    expect(
      puedeRecibirMision({ combustible: 25, enReparacion: false }, 0),
    ).toEqual({ puede: true });
  });

  it("rechaza una cuarta misión y acepta cuando hay menos de 3", () => {
    expect(
      puedeRecibirMision({ combustible: 90, enReparacion: false }, 3),
    ).toEqual({
      puede: false,
      motivo: "La nave ya tiene 3 misiones desde su última revisión.",
    });
    expect(
      puedeRecibirMision({ combustible: 90, enReparacion: false }, 2),
    ).toEqual({ puede: true });
  });
});
