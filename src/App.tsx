import { useCallback, useEffect, useState } from "react";
import FormularioMision from "./components/FormularioMision.tsx";
import FormularioNave from "./components/FormularioNave.tsx";
import ListaNaves from "./components/ListaNaves.tsx";
import { misionesService } from "./services/misionesService.ts";
import { navesService } from "./services/navesService.ts";
import type { Mision } from "./types/mision.ts";
import type { Nave } from "./types/nave.ts";
import "./App.css";

export default function App() {
  const [naves, setNaves] = useState<Nave[]>([]);
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [errorCarga, setErrorCarga] = useState("");

  const recargar = useCallback(async () => {
    try {
      const [listaNaves, listaMisiones] = await Promise.all([
        navesService.listar(),
        misionesService.listar(),
      ]);
      setNaves(listaNaves);
      setMisiones(listaMisiones);
      setErrorCarga("");
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "No se pudo leer el hangar.";
      setErrorCarga(mensaje);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return (
    <main className="hangar">
      <h1>Hangar Orbital</h1>
      <p>Registra las naves y asígnales misiones.</p>
      {errorCarga ? <p role="alert">{errorCarga}</p> : null}
      <FormularioNave alGuardar={recargar} />
      <FormularioMision naves={naves} alAsignar={recargar} />
      <ListaNaves naves={naves} misiones={misiones} />
    </main>
  );
}
