export type NaveParaMision = {
  combustible: number;
  enReparacion: boolean;
};

export type DecisionMision =
  | { puede: true }
  | { puede: false; motivo: string };

export function puedeRecibirMision(
  nave: NaveParaMision,
  misionesDesdeRevision: number,
): DecisionMision {
  if (nave.enReparacion) {
    return {
      puede: false,
      motivo: "La nave está en reparación y no puede recibir misiones.",
    };
  }
  if (nave.combustible < 25) {
    return {
      puede: false,
      motivo:
        "La nave no tiene combustible suficiente (hace falta al menos 25 %).",
    };
  }
  if (misionesDesdeRevision >= 3) {
    return {
      puede: false,
      motivo: "La nave ya tiene 3 misiones desde su última revisión.",
    };
  }
  return { puede: true };
}
