import { describe, expect, it } from "vitest";
import { validarNave } from "./validarNave.ts";

const fecha = "2026-11-09T12:00:00.000Z";

describe("validarNave", () => {
  it("acepta una nave válida y la marca revisada en la fecha de registro", () => {
    const resultado = validarNave(
      { nombre: "Aurora", clase: "exploradora", combustible: 80 },
      [],
      fecha,
    );
    expect(resultado).toEqual({
      valida: true,
      nave: {
        nombre: "Aurora",
        clase: "exploradora",
        combustible: 80,
        enReparacion: false,
        ultimaRevision: fecha,
      },
    });
  });

  it("indica qué falta si no hay nombre, clase o combustible", () => {
    const resultado = validarNave(
      { nombre: "  ", clase: "", combustible: null },
      [],
      fecha,
    );
    expect(resultado).toEqual({
      valida: false,
      motivos: [
        "Falta el nombre.",
        "Falta la clase.",
        "Falta el combustible.",
      ],
    });
  });

  it("rechaza un nombre repetido sin distinguir mayúsculas", () => {
    const resultado = validarNave(
      { nombre: "aurora", clase: "carguera", combustible: 40 },
      ["Aurora"],
      fecha,
    );
    expect(resultado.valida).toBe(false);
    if (!resultado.valida) {
      expect(resultado.motivos).toContain("Ya existe una nave con ese nombre.");
    }
  });

  it("rechaza una clase distinta de las tres", () => {
    const resultado = validarNave(
      { nombre: "Nova", clase: "caza", combustible: 50 },
      [],
      fecha,
    );
    expect(resultado.valida).toBe(false);
    if (!resultado.valida) {
      expect(resultado.motivos).toContain(
        "La clase debe ser exploradora, carguera o transporte.",
      );
    }
  });

  it("rechaza un combustible que no es un entero de 0 a 100", () => {
    const resultado = validarNave(
      { nombre: "Nova", clase: "transporte", combustible: 120 },
      [],
      fecha,
    );
    expect(resultado.valida).toBe(false);
    if (!resultado.valida) {
      expect(resultado.motivos).toContain(
        "El combustible debe ser un entero entre 0 y 100.",
      );
    }
  });

  it("acepta combustible 25 y también uno menor", () => {
    const conVeinticinco = validarNave(
      { nombre: "Luz", clase: "exploradora", combustible: 25 },
      [],
      fecha,
    );
    const conMenos = validarNave(
      { nombre: "Sombra", clase: "carguera", combustible: 10 },
      [],
      fecha,
    );
    expect(conVeinticinco.valida).toBe(true);
    expect(conMenos.valida).toBe(true);
  });
});
