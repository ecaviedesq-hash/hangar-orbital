import type { Mision } from "../types/mision.ts";
import type { Nave } from "../types/nave.ts";

type Props = {
  naves: readonly Nave[];
  misiones: readonly Mision[];
};

export default function ListaNaves({ naves, misiones }: Props) {
  if (naves.length === 0) {
    return (
      <section>
        <h2>Naves del hangar</h2>
        <p>Todavía no hay naves registradas.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Naves del hangar</h2>
      <ul>
        {naves.map((nave) => {
          const trabajos = misiones.filter((mision) => mision.naveId === nave.id);
          return (
            <li key={nave.id}>
              <strong>{nave.nombre}</strong> · {nave.clase} · combustible {nave.combustible} %
              {nave.enReparacion ? " · en reparación" : ""}
              {trabajos.length > 0 ? (
                <ul>
                  {trabajos.map((mision) => (
                    <li key={mision.id}>
                      {mision.destino}, despega el {mision.fechaDespegue}, {mision.duracionDias}{" "}
                      {mision.duracionDias === 1 ? "día" : "días"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
