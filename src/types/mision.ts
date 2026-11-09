export type Mision = {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
  createdAt: string;
};

export type MisionNueva = {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
};
