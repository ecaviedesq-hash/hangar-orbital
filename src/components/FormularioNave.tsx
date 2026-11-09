import { useState } from "react";
import type { FormEvent } from "react";
import { navesService } from "../services/navesService.ts";

type Props = {
  alGuardar: () => Promise<void>;
};

export default function FormularioNave({ alGuardar }: Props) {
  const [nombre, setNombre] = useState("");
  const [clase, setClase] = useState("");
  const [combustible, setCombustible] = useState("");
  const [motivos, setMotivos] = useState<string[]>([]);
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function registrar(evento: FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    setAviso("");
    setMotivos([]);
    const texto = combustible.trim();
    const valor = texto.length === 0 ? null : Number(texto);
    try {
      const resultado = await navesService.crear({
        nombre,
        clase,
        combustible: valor,
      });
      if (!resultado.ok) {
        setMotivos(resultado.motivos);
        return;
      }
      setNombre("");
      setClase("");
      setCombustible("");
      setAviso("La nave quedó registrada.");
      await alGuardar();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo registrar la nave.";
      setMotivos([mensaje]);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={registrar}>
      <h2>Registrar nave</h2>
      <label>
        Nombre
        <input
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
        />
      </label>
      <label>
        Clase
        <select value={clase} onChange={(evento) => setClase(evento.target.value)}>
          <option value="">Elige una clase</option>
          <option value="exploradora">Exploradora</option>
          <option value="carguera">Carguera</option>
          <option value="transporte">Transporte</option>
        </select>
      </label>
      <label>
        Combustible (0 a 100)
        <input
          inputMode="numeric"
          value={combustible}
          onChange={(evento) => setCombustible(evento.target.value)}
        />
      </label>
      <button type="submit" disabled={guardando}>
        Registrar
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
