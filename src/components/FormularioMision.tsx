import { useState } from "react";
import type { FormEvent } from "react";
import { misionesService } from "../services/misionesService.ts";
import type { Nave } from "../types/nave.ts";

type Props = {
  naves: readonly Nave[];
  alAsignar: () => Promise<void>;
};

export default function FormularioMision({ naves, alAsignar }: Props) {
  const [naveId, setNaveId] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaDespegue, setFechaDespegue] = useState("");
  const [duracion, setDuracion] = useState("");
  const [motivos, setMotivos] = useState<string[]>([]);
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function asignar(evento: FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    setAviso("");
    setMotivos([]);
    const texto = duracion.trim();
    const dias = texto.length === 0 ? null : Number(texto);
    try {
      const resultado = await misionesService.crear(
        { naveId, destino, fechaDespegue, duracionDias: dias },
        naves,
      );
      if (!resultado.ok) {
        setMotivos(resultado.motivos);
        return;
      }
      setDestino("");
      setFechaDespegue("");
      setDuracion("");
      setAviso("La misión quedó asignada.");
      await alAsignar();
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "No se pudo asignar la misión.";
      setMotivos([mensaje]);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={asignar}>
      <h2>Asignar misión</h2>
      <label>
        Nave
        <select value={naveId} onChange={(evento) => setNaveId(evento.target.value)}>
          <option value="">Elige una nave registrada</option>
          {naves.map((nave) => (
            <option key={nave.id} value={nave.id}>
              {nave.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Destino
        <input
          value={destino}
          onChange={(evento) => setDestino(evento.target.value)}
        />
      </label>
      <label>
        Fecha de despegue
        <input
          type="date"
          value={fechaDespegue}
          onChange={(evento) => setFechaDespegue(evento.target.value)}
        />
      </label>
      <label>
        Duración en días
        <input
          inputMode="numeric"
          value={duracion}
          onChange={(evento) => setDuracion(evento.target.value)}
        />
      </label>
      <button type="submit" disabled={guardando}>
        Asignar
      </button>
      {aviso ? <p>{aviso}</p> : null}
      {motivos.length > 0 ? (
        <ul>
          {motivos.map((motivo) => (
            <li key={motivo}>{motivo}</li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
