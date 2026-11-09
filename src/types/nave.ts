export type ClaseNave = "exploradora" | "carguera" | "transporte";

export type Nave = {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: boolean;
  ultimaRevision: string;
  createdAt: string;
};

export type NaveNueva = {
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: false;
  ultimaRevision: string;
};
